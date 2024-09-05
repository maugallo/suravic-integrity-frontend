import { Component, effect, input, OnDestroy, Output, output, signal } from '@angular/core';
import { IonSearchbar } from "@ionic/angular/standalone";
import { BehaviorSubject, filter, map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { outputFromObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: true,
  imports: [IonSearchbar,]
})
export class SearchBarComponent {

  searchForEntities(event: any) {

  }
  
}
