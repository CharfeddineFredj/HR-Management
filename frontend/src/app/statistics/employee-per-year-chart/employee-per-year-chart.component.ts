import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ChartOptions, ChartType, ChartData, Plugin } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { EmployeeService } from 'src/app/sevices/employee.service';



@Component({
  selector: 'app-employee-per-year-chart',
  templateUrl: './employee-per-year-chart.component.html',
  styleUrls: ['./employee-per-year-chart.component.css']
})
export class EmployeePerYearChartComponent implements OnInit {
  public chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          },
          color: '#333'
        }
      },
      tooltip: {
        enabled: true
      },
      datalabels: {
        formatter: (value, context) => value,
        color: '#36A2EB',
        font: {
          size: 12,
          weight: 'bold'
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Years'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Number of employees'
        },
        min: 0
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuad'
    }
  };

  public chartData: ChartData<'line', number[], string> = {
    labels: [],
    datasets: [
      {
        label: 'Number of employees',
        data: [],
        fill: false,
        borderColor: '#36A2EB',
        backgroundColor: '#36A2EB',
        tension: 0.1
      }
    ]
  };

  public chartType: ChartType = 'line';
  public chartLegend = true;
  public chartPlugins: Plugin[] = [ChartDataLabels];
  public isLoading = true;

  constructor(private employeeService: EmployeeService, private cdr: ChangeDetectorRef, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData(): void {
    this.employeeService.getEmployeeCountPerYear().subscribe({
      next: data => {
        this.ngZone.run(() => {


          // Transform the data object into arrays for Chart.js
          const labels = Object.keys(data).map(key => key); // Convert keys to strings
          const values = Object.values(data) as number[]; // Assert values as number[]

          this.chartData.labels = labels;
          this.chartData.datasets[0].data = values;

          this.cdr.markForCheck();
          this.isLoading = false;
        });
      },
      error: err => {
        console.error('Error fetching data', err);
        this.isLoading = false;
      }
    });
  }

  downloadChart(format: string): void {
    const chart = document.getElementById('employeePerYearChart') as HTMLCanvasElement;
    if (chart) {
      if (format === 'png') {
        const link = document.createElement('a');
        link.href = chart.toDataURL('image/png');
        link.download = 'employee_per_year_chart.png';
        link.click();
      } else if (format === 'svg') {
        const svg = this.convertToSVG(chart);
        const link = document.createElement('a');
        link.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        link.download = 'employee_per_year_chart.svg';
        link.click();
      }
    }
  }

  downloadCSV(): void {
    const csv = this.convertToCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'employee_per_year_chart.csv';
    link.click();
  }

  convertToSVG(chart: HTMLCanvasElement): string {
    const xmlSerializer = new XMLSerializer();
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', chart.width.toString());
    svg.setAttribute('height', chart.height.toString());
    const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    foreignObject.setAttribute('width', '100%');
    foreignObject.setAttribute('height', '100%');
    foreignObject.appendChild(chart);
    svg.appendChild(foreignObject);
    return xmlSerializer.serializeToString(svg);
  }

  convertToCSV(): string {
    const rows = [];
    rows.push(['Year', 'Number of employees']);
    this.chartData.labels.forEach((label, index) => {
      rows.push([label, this.chartData.datasets[0].data[index]]);
    });
    return rows.map(row => row.join(',')).join('\n');
  }
}
