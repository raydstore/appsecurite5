export type TFunctionName = <T, K>(item: T, arg: K) => any;
export enum Mode {insert = 0, update = 1, delete = 2}
export interface EventArgs {
    item: any;
    mode: Mode;
    dialogVisible: boolean;
}

export interface Activity {
    id?: number;
    name?: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Mark {
    id?: number;
    name?: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Label {
    id?: number;
    name?: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface TypeObject {
    id?: number;
    name?: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface TypeOperation {
    id?: number;
    name?: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface UnitMeasure {
    id?: number;
    name?: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}


export interface Site {
    id?: number;
    name?: string;
    idlabel?: any;
    idparent?: Site;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}


export interface Titletask {
    id?: number;
    name?: string;
    kind?: string;
    idparent?: number;
    kindparent?: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Object {
    id?: number;
    name?: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Property {
    propertyPK?: any;
    type?: string;
    name?: string;
    idunitmeasure?: any;
    object1?: any;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Instance {
    id?: number;
    idobject?: any;
    idsite?: any;
    idmark?: any;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Operation {
    id?: number;
    name?: string;
    idTypeOperation?: any;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Jobposting {
    id?: number;
    idAgent?: any;
    idSite?: any;
    datefirst?: Date;
    datelast?: Date;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Listagent {
    id?: number;
    agent?: any;
    jobposting?: any;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Caseagent {
    id?: number;
    idAgent?: any;
    case?: string;
    idJobposting?: any;
    datefirst?: Date;
    datelast?: Date;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Nature {
    id?: number;
    name?: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Element {
    id?: number;
    name?: string;
    idnature?: any;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Rank {
    id?: number;
    name?: string;
    investigation?: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Grid {
    id?: number;
    name?: string;
    idelement?: any;
    idrank?: any;
    degree?: number;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Accident {
    id?: number;
    classification?: string;
    sitedescription?: string;
    event?: string;
    idsiteparent?: any;
    idsite?: any;
    curdate?: Date;
    time?: Date;
    tabindex?: number;
    idagentdeclare?: Agent;
    idagentvalidate?: Agent;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface IAgent {
    agent: Agent;
    name: string;
}

export interface AccidentnaturePK {
    idaccident?: any;
    idnature?: number;
}

export interface Accidentnature {
    accidentnaturePK?: AccidentnaturePK;
    accident?: any;
    idaccident?: any;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Damage {
    id?: number;
    accidentdomain?: number;
    accidentnature?: any;
    idgrid?: number;
    degree?: string;
    description?: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Cause {
    id?: number;
    name?: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Recommendation {
    id?: number;
    name?: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Bit {
    id?: string;
    name?: string;
    kind?: string;
    idparent?: string;
    kindparent?: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Agent {
    id?: string;
    firstname?: string;
    lastname?: string;
    hiredate?: Date;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface AccidentagentshPK {
    iddamage: number;
    idagent: string;
}

export interface AccidentagenteePK {
    iddamage: number;
    id: number;
}

export interface AccidentagenttpPK {
    iddamage: number;
    id: number;
}

export interface Accidentagentsh {
    accidentagentshPK: AccidentagentshPK;
    idagent?: string;
    countstopwork: number;
    accidentdomain: number;
    typeaccident: string;
    idgrid: number;
    samury: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Accidentagentee {
    accidentagenteePK: AccidentagenteePK;
    name?: string;
    function?: string;
    identreprise?: any;
    countstopwork: number;
    accidentdomain: number;
    typeaccident: string;
    idgrid: number;
    samury: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Accidentagenttp {
    accidentagenttpPK: AccidentagenttpPK;
    name?: string;
    function?: string;
    countstopwork: number;
    accidentdomain: number;
    typeaccident: string;
    idgrid: number;
    samury: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Accidentvehicule {
    id?: number;
    iddamage?: number;
    idgrid: number;
    accidentdomain?: number;
    identreprise?: any;
    idmark?: any;
    name?: string;
    source?: string;
    destination?: string;
    classification: string;
    kind: string;
    matricule: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Accidentcause {
    id?: number;
    idaccident?: number;
    idgrid?: number;
    idnature?: number;
    accidentdomain: number;
    description?: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Accidentagentshbit {
    id?: number;
    iddamage: number;
    idagent: string;
    idbit: string;
    idbitclass: string;
    kind: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Bitclass {
    id?: string;
    kind: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Vw$accidentagentshbit {
    iddamage: number;
    idagent: string;
    idbitclass?: string;
    classname?: string;
    name?: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Action {
    id?: number;
    idparent?: number;
    kind?: string;
    state?: string;
    name: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Actionassignment {
    idaction?: number;
    idstructure?: number;
    sendin?: Date;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Structure {
    id?: number;
    name: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Entreprise {
    id?: number;
    name: string;
    adress: string;
    phone: string;
    fiscalenumber: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Accidentmaterial {
    id?: number;
    name?: string;
    damagename?: string;
    accidentdomain?: number;
    iddamage?: number;
    idgrid?: number;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface DamageDefinition {
    id?: number;
    name?: string;
    accidentdomain?: number;
    iddamage?: number;
    idgrid?: number;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}

export interface Accidentfile {
    id?: number;
    idaccident?: any;
    name: string;
    path?: string;
    owner?: string;
    lastuser?: string;
    datecreate?: Date;
    dateupdate?: Date;
}