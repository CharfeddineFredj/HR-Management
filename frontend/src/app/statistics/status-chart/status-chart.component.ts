import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ChartOptions, ChartType, ChartData, Plugin } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { EmployeeService } from 'src/app/sevices/employee.service';


@Component({
  selector: 'app-status-chart',
  templateUrl: './status-chart.component.html',
  styleUrls: ['./status-chart.component.css']
})
export class StatusChartComponent implements OnInit {
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
        formatter: (value, context) => {
          const dataset = context.chart.data.datasets[0];
          const total = (dataset.data as number[]).reduce((prev: number, curr: number) => prev + curr, 0);
          const percentage = total > 0 ? Math.round(value / total * 100) + '%' : '0%';
          return percentage;

        },
        color: '#fff',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuad'
    }
  };

  public chartLabels: string[] = ['Active', 'Deactivated'];
  public chartData: ChartData<'pie', number[], string> = {
    labels: this.chartLabels,
    datasets: [
      {
        data: [],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB90', '#FF638490'],
        borderWidth: 1
      }
    ]
  };
  public isLoading = true;
  public chartType: ChartType = 'pie';
  public chartLegend = true;
  public chartPlugins: Plugin[] = [ChartDataLabels];

  constructor(private employeeService: EmployeeService, private cdr: ChangeDetectorRef, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData(): void {
    this.employeeService.getEmployeeCountByStatus().subscribe({
      next: data => {
        this.ngZone.run(() => {
          this.chartData.datasets[0].data = [
            data.Active || 0,
            data.Deactivated || 0
          ];
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
    const chart = document.getElementById('statusChart') as HTMLCanvasElement;
    if (chart) {
      if (format === 'png') {
        const link = document.createElement('a');
        link.href = chart.toDataURL('image/png');
        link.download = 'status_chart.png';
        link.click();
      } else if (format === 'svg') {
        const svg = this.convertToSVG(chart);
        const link = document.createElement('a');
        link.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        link.download = 'status_chart.svg';
        link.click();
      }
    }
  }

  downloadCSV(): void {
    const csv = this.convertToCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'status_chart.csv';
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
    rows.push(['Label', 'Value']);
    this.chartData.labels.forEach((label, index) => {
      rows.push([label, this.chartData.datasets[0].data[index]]);
    });
    return rows.map(row => row.join(',')).join('\n');
  }
}
