import {ChangeDetectionStrategy, Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {addMinutes, endOfDay, isSameDay, isSameMonth, startOfDay} from 'date-fns';
import {Subject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CalendarEvent, CalendarEventAction, CalendarView} from 'angular-calendar';
import {PartnerService} from '../../service/partner.service';
import {ActivatedRoute} from '@angular/router';
import {Request} from '../../models/request.model';
import {ClientService} from '../../service/client.service';
import {map} from 'rxjs/operators';
import {I18nService} from '../../service/i18n.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  green: {
    primary: 'green',
    secondary: 'green'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-schedule',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['schedule.component.css'],
  templateUrl: './schedule.component.html'
})
export class ScheduleComponent implements OnInit {
  @ViewChild('modalContent')
  modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  partnerId: number ;
  newRequestedRequests: Request[] = [];
  acceptedRequests: Request[] = [];
  doneRequests: Request[] = [];

  selfRequest: Request = <Request>{};
  sysGrowlMsgs: any[] = [];


  modalData: Request;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.partnerService.deleteReservation( event.id + '').subscribe(isDeleted => {
          if (isDeleted) {
            this.acceptedEvents = this.acceptedEvents.filter(iEvent => iEvent !== event);
            this.sysGrowlMsgs.push({severity: 'success', detail: 'Delete action is completely done.'});
            this.refresh.next();
          }
        });
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  acceptedEvents: CalendarEvent[] = [];
  requestedEvents: CalendarEvent[] = [];

  activeDayIsOpen = true;

  constructor(public newEventDialog: MatDialog,
              private partnerService: PartnerService,
              private clientService: ClientService,
              private modal: NgbModal,
              private i18Service: I18nService,
              private activeRoute: ActivatedRoute) {}



  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.handlseNewEvendDialog(date);
    if (events !== undefined && this.view === CalendarView.Month && isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  handlseNewEvendDialog(date: Date) {
    if (date.getTime() < new Date().getTime()) { return; }
    this.selfRequest.startTime = date;
    this.selfRequest.partnerId = this.partnerId;
    this.selfRequest.status = 2;
    this.selfRequest.description = 'self request';
    const dialogRef = this.newEventDialog.open( NewEventDialogComponent, {
      width: '40%',
      height: '50%',
      data: this.selfRequest
    });


    dialogRef.afterClosed().subscribe((value) => {
      if (this.selfRequest.isSaved) {
        this.acceptedEvents.push({
          id: this.selfRequest.id,
          start: this.selfRequest.startTime,
          end: addMinutes(this.selfRequest.startTime, this.selfRequest.duration),
          title: this.selfRequest.description + ' : ' + this.selfRequest.startTime,
          color: colors.green,
          actions: this.actions,
          allDay: false,
          resizable: {
            beforeStart: false,
            afterEnd: false
          },
          draggable: false
        });
        this.refresh.next();
      }
      this.selfRequest.isSaved = false;
      this.selfRequest.duration = null;
      this.selfRequest.startTime = null;
    });

  }

  handleEvent(event: CalendarEvent): void {
    this.acceptedRequests.forEach(request => {
      if (request.id === event.id) {
        this.modalData = request;
      }
    });
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.requestedEvents.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: false,
      resizable: {
        beforeStart: false,
        afterEnd: false
      }
    });
    this.refresh.next();
  }



  ngOnInit(): void {
   this.initPartner();
  }

  private initPartner(): void {
    this.activeRoute.params.subscribe(value => {
      this.partnerId = value['partnerId'];
      this.initRequestedRequestsForPartner();
      this.initAcceptedRequestsForPartner();
      this.initDoneRequestsForPartner();
    });
  }

  private initRequestedRequestsForPartner() {
    this.partnerService.getReservationsForPartner(this.partnerId, 1).pipe( map(value => {
      this.newRequestedRequests = value;
    })).pipe( map( () => {
      this.newRequestedRequests.forEach(request => {
        this.clientService.getClientById(request.clientId).pipe( map(client => {
          request.client = client;
        }));
      });
    })).pipe( map( () => {
      this.newRequestedRequests.forEach(request => {
        this.partnerService.getServiceDetialsByPartnerId(request.partnerId, request.serviceId).pipe( map(serviceDetail => {
          request.partnerServiceDetail = serviceDetail;
        }));
      });
    }));
  }

  private initAcceptedRequestsForPartner() {
    this.partnerService.getReservationsForPartner(this.partnerId, 2).pipe( map(value => {
      this.acceptedRequests = value;
    })).pipe( map( () => {
      this.acceptedRequests.forEach(request => {
        if (request.clientId != null) {
          this.clientService.getClientById(request.clientId).pipe( map(client => request.client = client));
        }
      });
    })).pipe( map( () => {
      this.acceptedRequests.forEach(request => {
        if (request.serviceId != null ) {
           this.partnerService.getServiceDetialsByPartnerId(request.partnerId, request.serviceId).pipe( map(serviceDetail => {
             request.partnerServiceDetail = serviceDetail;
           }));
        }
      });
    })).subscribe(value => {
      this.initAcceptedEvents();
    });
  }

  private initDoneRequestsForPartner() {
    this.partnerService.getReservationsForPartner(this.partnerId, 3).subscribe(value => {
      this.doneRequests = value;
    });
  }

  private initRejectedRequestsForPartner() {
    this.partnerService.getReservationsForPartner(this.partnerId, 4).subscribe(value => {

    });
  }

  private initNewEvents() {
    this.newRequestedRequests.forEach(value => {
      this.requestedEvents.push({
        start: new Date(value.startTime),
          end: addMinutes(value.startTime, value.partnerServiceDetail.defaultduration),
        title: value.client.telephone,
        color: colors.yellow,
        actions: this.actions,
        allDay: false,
        resizable: {
        beforeStart: false,
          afterEnd: false
      },
        draggable: false
      });
    });
  }

  private initAcceptedEvents() {
    this.acceptedRequests.forEach(value => {
      this.acceptedEvents.push({
        id: value.id,
        start: new Date(value.startTime),
          end: addMinutes(value.startTime, value.duration),
        title: value.clientId == null ? value.description : value.client.telephone,
        color: colors.green,
        actions: this.actions,
        allDay: false,
        resizable: {
        beforeStart: false,
          afterEnd: false
      },
        draggable: false
      });
      this.refresh.next();
    });
  }

}

interface MatObj {
  request: Request;
  event: Event;
}

@Component({
  selector: 'app-add-event-dialog',
  templateUrl: './new-event-component/new-event.component.html',
  styleUrls: ['./new-event-component/new-event.component.css']
})
export class NewEventDialogComponent {
  msgs: any[];
  copyOfStartTime: Date;

  constructor(private partnerService: PartnerService,
    public dialogRef: MatDialogRef<NewEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public selfRequest: Request) {
    this.copyOfStartTime = new Date(this.selfRequest.startTime);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  saveRequest(event) {
    if (this.selfRequest !== undefined) {
      this.selfRequest.startTime.setHours(this.copyOfStartTime.getHours(), this.copyOfStartTime.getMinutes());
      this.partnerService.saveReservation(this.selfRequest).pipe(map(value1 => {
        this.selfRequest.id = value1;
        this.selfRequest.isSaved = true;
      })).subscribe(() => {
          this.selfRequest.isSaved = true;
          this.dialogRef.close(this.selfRequest);
        },
        error1 => {
          this.selfRequest.duration = null;
          this.msgs = [];
          if (error1.error.crossedrequestduration !== undefined) {
            this.msgs.push({severity: 'error', summary: '', detail: error1.error.crossedrequestduration});
          }
          if (error1.error.isWrongDuration !== undefined) {
            this.msgs.push({severity: 'error', summary: '', detail: error1.error.isWrongDuration});
          }
        });
    }
  }
}

