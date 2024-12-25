import { EpilotTheme } from "@epilot/epilot-journey-sdk"
import { EventRefType, InviteeRefType } from "./calendly-service"

export type CalendlyBlockProps = {
    theme: EpilotTheme
    url: string
    onChange: (data: CalendlyBlockData) => void
    token: string
}

export type CalendlyBlockData = {
    event: EventRefType,
    invitee: InviteeRefType
}