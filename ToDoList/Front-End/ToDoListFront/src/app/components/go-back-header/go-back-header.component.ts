import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-go-back-header',
  templateUrl: './go-back-header.component.html',
  styleUrls: ['./go-back-header.component.scss']
})
export class GoBackHeaderComponent implements OnInit {

  @Input() backRoute = '/home';

  constructor() { }

  ngOnInit(): void {
  }

}
