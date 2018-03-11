import { AccidentagentshbitService } from './services/accidentagentshbit.service';
import { BitclassService } from './services/bitclass.service';
import { RecommendationService } from './services/recommendation.service';
import { CauseService } from './services/cause.service';
import { AccidentnatureService } from './services/accidentnature.service';
import { VwnotnatureofaccidentService } from './services/vwnotnatureofaccident.service';
import { AccidentvehiculeService } from './services/accidentvehicule.service';
import { VwdamageaccidentnatureService } from './services/vwdamageaccidentnature.service';
import { VwaccidentnatureService } from './services/vwaccidentnature.service';
import { VwdamageService } from './services/vwdamage.service';
import { VwelementdamageService } from './services/vwelementdamage.service';
import { AccidentagenttpService } from './services/accidentagenttp.service';
import { AccidentagenteeService } from './services/accidentagentee.service';
import { AgentService } from './services/agent.service';
import { BitService } from './services/bit.service';
import { TitletaskComponent } from './page/titletask/titletask.component';
import { RankService } from './services/rank.service';
import { NatureService } from './services/nature.service';
import { ListagentService } from './services/listagent.service';
import { CaseagentService } from './services/caseagent.service';
import { VPropertyService } from './services/vproperty.service';
import { IPropertyService } from './services/iproperty.service';
import { VwpropertyService } from './services/vwproperty.service';
import { PropertyService } from './services/property.service';
import { ObjectService } from './services/object.service';
import { LastidService } from './services/lastid.service';
import { TypeOperationService } from './services/type-operation.service';
import { TypeObjectService } from './services/type-object.service';
import { UnitMeasureService } from './services/unit-measure.service';
import { ActivityService } from './services/activity.service';
import { MarkService } from './services/mark.service';
import { TitletaskService } from './services/titletask.service';
import { NotFoundComponent } from './page/notfound/notFound.component';
import { SiteService } from './services/site.service';
import { SitesComponent } from './page/site/sites.component';
import { OrganizationChartModule, DataGridModule, TreeTableModule, DropdownModule } from 'primeng/primeng';
import { LabelsComponent } from './page/label/labels.component';
import { AppErrorHandler } from './common/app-error-handler';
import { PostService } from './services/post.service';
import { LabelService } from './services/label.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';

import { AppComponent } from './app.component';
import { PostsComponent } from './posts/posts.component';
import { NavComponent } from './nav/nav.component';
import { OrganizationChartComponent } from './organization-chart/organization-chart.component';

import { CommonModule } from '@angular/common';
/* import { OrganizationChartDemoRoutingModule } from 'primeng/primeng'; */
import { GrowlModule } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/primeng';
import { CodeHighlighterModule } from 'primeng/primeng';
import { InplaceModule } from 'primeng/primeng';
import {DialogModule} from 'primeng/primeng';
import { MarkComponent } from './page/mark/mark.component';
import { TypeObjectComponent } from './page/type-object/type-object.component';
import { TypeOperationComponent } from './page/type-operation/type-operation.component';
import { OperationComponent } from './page/operation/operation.component';
import { ActivityComponent } from './page/activity/activity.component';
import { ObjectComponent } from './page/object/object.component';
import { InstanceComponent } from './page/instance/instance.component';
import { UnitmeasureComponent } from './page/unitmeasure/unitmeasure.component';
import { JobpostingComponent } from './page/jobposting/jobposting.component';
import { TypeFormationComponent } from './page/type-formation/type-formation.component';
import { FormationComponent } from './page/formation/formation.component';
import { AlertComponent } from './page/alert/alert.component';
import { Input } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModalComponent } from './page/dialog-modal/dialog-modal.component';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { PropertyComponent } from './page/property/property.component';
import { VwpropertyComponent } from './page/vwproperty/vwproperty.component';
import { InstanceObjectComponent } from './page/instance-object/instance-object.component';
import { InstanceService } from './services/instance.service';
import { DPropertyService } from './services/dproperty.service';
import { NPropertyService } from './services/nproperty.service';
import { SiteNameComponent } from './page/site-name/site-name.component';
import { HomeComponent } from './home/home.component';
import { OperationService } from './services/operation.service';
import { JobpostingService } from './services/jobposting.service';
import { CaseagentComponent } from './page/caseagent/caseagent.component';
import { ListagentComponent } from './page/listagent/listagent.component';
import { NatureComponent } from './page/nature/nature.component';
import { ElementComponent } from './page/element/element.component';
import { RankComponent } from './page/rank/rank.component';
import { GridComponent } from './page/grid/grid.component';
import { ElementService } from './services/element.service';
import { GridService } from './services/grid.service';
import { AccidentComponent } from './page/accident/accident.component';
import { AccidentnatureComponent } from './page/accidentnature/accidentnature.component';
import { DamageComponent } from './page/damage/damage.component';
import { CauseComponent } from './page/cause/cause.component';
import { RecommendationComponent } from './page/recommendation/recommendation.component';
import { BitComponent } from './page/bit/bit.component';
import { AgentComponent } from './page/agent/agent.component';
import { AccidentService } from './services/accident.service';
import { AccidentagentshComponent } from './page/accidentagentsh/accidentagentsh.component';
import { AccidentagentshService } from './services/accidentagentsh.service';
import { ElementswitchComponent } from './page/elementswitch/elementswitch.component';
import { AccidentagenteeComponent } from './page/accidentagentee/accidentagentee.component';
import { AccidentagenttpComponent } from './page/accidentagenttp/accidentagenttp.component';
import { AccidentdetailComponent } from './page/accidentdetail/accidentdetail.component';
import { ElementdamageComponent } from './page/elementdamage/elementdamage.component';
import { AccidentvehiculeComponent } from './page/accidentvehicule/accidentvehicule.component';
import { AccidentvehiculeshComponent } from './page/accidentvehiculesh/accidentvehiculesh.component';
import { AccidentvehiculenonshComponent } from './page/accidentvehiculenonsh/accidentvehiculenonsh.component';
import { VwnotnatureofaccidentComponent } from './page/vwnotnatureofaccident/vwnotnatureofaccident.component';
import { AccidentagentshbitComponent } from './page/accidentagentshbit/accidentagentshbit.component';
import { Vw$accidentagentshbitService } from './services/vw$accidentagentshbit.service';


@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    LabelsComponent,
    SitesComponent,
    NavComponent,
    OrganizationChartComponent,
    NotFoundComponent,
    TitletaskComponent,
    MarkComponent,
    TypeObjectComponent,
    TypeOperationComponent,
    OperationComponent,
    ActivityComponent,
    ObjectComponent,
    InstanceComponent,
    UnitmeasureComponent,
    JobpostingComponent,
    TypeFormationComponent,
    FormationComponent,
    AlertComponent,
    DialogModalComponent,
    PropertyComponent,
    VwpropertyComponent,
    InstanceObjectComponent,
    SiteNameComponent,
    HomeComponent,
    OperationComponent,
    CaseagentComponent,
    ListagentComponent,
    NatureComponent,
    ElementComponent,
    RankComponent,
    GridComponent,
    AccidentComponent,
    AccidentnatureComponent,
    DamageComponent,
    CauseComponent,
    RecommendationComponent,
    BitComponent,
    AgentComponent,
    AccidentagentshComponent,
    ElementswitchComponent,
    AccidentagenteeComponent,
    AccidentagenttpComponent,
    AccidentdetailComponent,
    ElementdamageComponent,
    AccidentvehiculeComponent,
    AccidentvehiculeshComponent,
    AccidentvehiculenonshComponent,
    VwnotnatureofaccidentComponent,
    AccidentagentshbitComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    OrganizationChartModule,
    CommonModule,
    OrganizationChartModule,
    DataGridModule,
    GrowlModule,
    PanelModule,
    TabViewModule,
    TreeTableModule,
    InplaceModule,
    DropdownModule,
    DialogModule,
    DataTableModule,
    CheckboxModule,
    SharedModule,
    CodeHighlighterModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/home' , pathMatch: 'full'},
      { path: 'activity', component: ActivityComponent },
      { path: 'label', component: LabelsComponent },
      { path: 'mark', component: MarkComponent },
      { path: 'typeobject', component: TypeObjectComponent },
      { path: 'typeoperation', component: TypeOperationComponent },
      { path: 'operation', component: OperationComponent },
      { path: 'unitmeasure', component: UnitmeasureComponent },
      { path: 'site', component: SitesComponent },
      { path: 'object', component: ObjectComponent },
      { path: 'operation', component: OperationComponent },
      { path: 'titletask', component: TitletaskComponent },
      { path: 'instance', component: InstanceComponent },
      { path: 'jobposting', component: JobpostingComponent },
      { path: 'home', component: HomeComponent },
      { path: 'agent', component: AgentComponent },
      { path: 'nature', component: NatureComponent },
      { path: 'element', component: ElementComponent },
      { path: 'rank', component: RankComponent },
      { path: 'grid', component: GridComponent },
      { path: 'bit', component: BitComponent },
      { path: 'accident', component: AccidentComponent },
      { path: '**', component: NotFoundComponent }
    ])
  ],
  providers: [
    PostService,
    LabelService,
    SiteService,
    TitletaskService,
    MarkService,
    ActivityService,
    UnitMeasureService,
    TypeObjectService,
    TypeOperationService,
    OperationService,
    LastidService,
    ObjectService,
    PropertyService,
    InstanceService,
    VwpropertyService,
    DPropertyService,
    IPropertyService,
    NPropertyService,
    VPropertyService,
    JobpostingService,
    CaseagentService,
    ListagentService,
    NatureService,
    ElementService,
    RankService,
    GridService,
    BitService,
    AgentService,
    AccidentService,
    AccidentagentshService,
    AccidentagenteeService,
    AccidentagenttpService,
    VwelementdamageService,
    VwdamageService,
    VwaccidentnatureService,
    VwdamageaccidentnatureService,
    AccidentvehiculeService,
    VwnotnatureofaccidentService,
    AccidentnatureService,
    CauseService,
    RecommendationService,
    BitclassService,
    AccidentagentshbitService,
    Vw$accidentagentshbitService,
    {provide: ErrorHandler, useClass: AppErrorHandler}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
