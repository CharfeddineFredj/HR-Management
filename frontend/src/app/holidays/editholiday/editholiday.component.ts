import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Holiday, HolidayService } from 'src/app/sevices/holiday.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editholiday',
  templateUrl: './editholiday.component.html',
  styleUrls: ['./editholiday.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EditholidayComponent implements OnInit {
  holiday: Holiday = new Holiday();
  holidayId: number;

  constructor(
    private holidayService: HolidayService,
    private route: ActivatedRoute,
    private router: Router // Add router to handle redirection
  ) {}

  ngOnInit(): void {
    // Get the holiday ID from the route
    this.holidayId = +this.route.snapshot.paramMap.get('id');

    // Fetch the holiday details by ID
    this.holidayService.getHolidayById(this.holidayId).subscribe(data => {
      this.holiday = data;
    });
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      // Show SweetAlert confirmation
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to edit this holiday?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, edit it!',
        cancelButtonText: 'No, cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceed with the update
          this.holidayService.updateHoliday(this.holidayId, this.holiday).subscribe(
            (response) => {
              // Show success message
              Swal.fire('Success!', 'Holiday updated successfully.', 'success');

              // Redirect to the list of holidays
              this.router.navigate(['/home/listHolidays']);
            },
            (error) => {
              // Show error message
              Swal.fire('Error!', 'There was an error updating the holiday.', 'error');
              console.error('Error updating holiday', error);
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Your holiday edit was cancelled.', 'info');
        }
      });
    }
  }
}
