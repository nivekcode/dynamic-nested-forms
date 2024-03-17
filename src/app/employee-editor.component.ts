import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {FormArray, FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import { AsyncPipe, JsonPipe } from "@angular/common";

@Component({
  standalone: true,
  selector: "employee-editor",
  template: `
      <h2>Employee Editor</h2>

      <div [formGroup]="employeeForm">
          <ng-container formArrayName="employees">
              @for (employee of employees.controls;track employee; let employeeIndex = $index) {
                  <div class="card">
                      <div [formGroupName]="employeeIndex">
                          <fieldset class="form-field">
                              <label>Name</label>
                              <input type="text" formControlName="name">
                          </fieldset>
                          <fieldset class="form-field">
                              <label>Firstname</label>
                              <input type="text" formControlName="firstname">
                          </fieldset>
                          <ng-container formArrayName="skills">
                              @for (skill of getSkills(employeeIndex).controls; track skill) {
                                  <div [formGroupName]="$index">
                                      <fieldset class="form-field">
                                          <label>SkillName</label>
                                          <input type="text" formControlName="skillname">
                                      </fieldset>
                                      <fieldset class="form-field">
                                          <label>Rating</label>
                                          <input type="number" formControlName="rating">
                                      </fieldset>
                                  </div>
                              }
                          </ng-container>
                          <button (click)="addSkills(employeeIndex)">Add Skills</button>
                      </div>
                  </div>
              }
          </ng-container>
      </div>

      <button (click)="addEmployee()">Add Employee</button>

      {{ employeeForm.valueChanges | async | json }}
  `,
  styles: [`

    button {
      margin: 20px;
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .card {
      color: black;
      padding: 20px;
      margin: 20px;
      background-color: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    fieldset {
      display: flex;
      flex-direction: column;
      border: none;
    }
  `],
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    JsonPipe
],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeEditorComponent {
  private fb = inject(FormBuilder);

  employeeForm = this.fb.group({
    employees: this.fb.array([])
  });

  addEmployee() {
    const employee = this.fb.group({
      firstname: ["", Validators.required],
      name: ["", Validators.required],
      skills: this.fb.array([])
    }) as any;
    this.employees.push(employee);
  }

  addSkills(index: number){
    const employee = this.employees.at(index);
    const skills = employee.get("skills") as FormArray;
    skills.push(this.fb.group({
      skillname: ["", Validators.required],
      rating: [0, Validators.required],
    }));
  }

  getSkills(employeeIndex: number){
    const employee = this.employees.at(employeeIndex);
    return employee.get("skills") as FormArray;
  }

  get employees() {
    return this.employeeForm.controls.employees as FormArray;
  }
}
