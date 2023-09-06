/** @see {isJourneyMode} ts-auto-guard:type-guard */
export type JourneyMode = 'inline' | 'full-screen'


export type ContextData = Record<string, unknown>


// the fields are firstName, lastName, email, telephone, birthDate, companyName, registryCourt, registerNumber
export enum PersonalInformationField {
    FirstName = 'firstName',
    LastName = 'lastName',
    Email = 'email',
    Phone = 'telephone',
    BirthDate = 'birthDate',
    CompanyName = 'companyName',
    RegistryCourt = 'registryCourt',
    RegisterNumber = 'registerNumber'
}

// fields are countryCode, zipCity, streetName, houseNumber, extention
export enum AddressField {
    CountryCode = 'countryCode',
    StreetName = 'streetName',
    HouseNumber = 'houseNumber',
    Extention = 'extention',
    ZipCity = 'zipCity'
}

// the fields are startDate, endDate
export enum DateField {
    StartDate = 'startDate',
    EndDate = 'endDate'
}

export type BlockDisplaySetting = {
    /** type of the display setting, for now only disabling fields */
    type: 'DISABLED'
    /** the block name that we want to apply the setting to it */
    blockName: string
    /** the step index where the block is located */
    stepIndex: number
    /** this one is used for the more complex blocks. like: Personal Information, Address ...etc */
    blockFields: DateField[] | PersonalInformationField[] | AddressField[]
}

export type DataInjectionOptions = {
    /** the initial step index of the journey. aka, where to start the journey from */
    initialStepIndex?: number
    /** the initial state of the journey. aka, what data to prefill the journey with */
    initialState?: Record<string, unknown>[]

    /** the display options to be passed to the journey, for now it is used to disable some fields */
    blocksDisplaySettings?: BlockDisplaySetting[]
}

export type OptionsInit = {
    /** id of the journey to initialise (load configuration) */
    journeyId: string
    /** url to override iframe src */
    journeyUrl?: string
    /** mode the journey runs in -> inline | full-screen */
    mode: JourneyMode
    /** the minimum height the journey runs in when in inline mode */
    minHeight?: string
    /**
     * whether to show or hide the topBar
     * @default true
     */
    topBar?: boolean
    /**
     * whether to scroll to the top after step navigation
     * @default true
     */
    scrollToTop?: boolean
    /**
     * whether to show the closeButton if in inline mode
     * @default true
     */
    closeButton?: boolean
    /** additional data passed to the journey + submission */
    contextData?: Record<string, unknown>
    /** the language the journey should be initialised in */
    lang?: string
    /** the data injext options that will be passed to the journey */
    dataInjectionOptions?: DataInjectionOptions
}
export type OptionsUpdate = Omit<OptionsInit, 'journeyId'>

export type JourneyEvent =
    | 'init'
    | 'enterFullScreen'
    | 'exitFullScreen'
    | 'closeJourney'
    | 'formChange'

export enum JourneyEventType {
    init = 'EPILOT/INIT',
    updateJourney = 'EPILOT/UPDATE_JOURNEY',
    exitFullScreen = 'EPILOT/EXIT_FULLSCREEN',
    enterFullScreen = 'EPILOT/ENTER_FULLSCREEN',
    closeJourney = 'EPILOT/CLOSE_JOURNEY',
    formChange = 'EPILOT/FORM_EVENT'
}


type enterFullScreen = (
    journeyId: string,
    payload?: { isLauncherJourney?: boolean } & Record<string, unknown>
) => void

type init = (options?: OptionsInit[], initOnLoad?: boolean) => void

type exitFullScreen = (
    journeyId: string,
    payload?: { isLauncherJourney?: boolean } & Record<string, unknown>
) => void

type on = (
    eventName: JourneyEvent,
    cb: (payload: Record<string, unknown>, event: CustomEvent) => void
) => void

type isInitialized = (journeyId: string) => boolean

export type __epilot = {
    isInitialized: isInitialized,
    on: on,
    init: init,
    enterFullScreen: enterFullScreen,
    exitFullScreen: exitFullScreen,
}