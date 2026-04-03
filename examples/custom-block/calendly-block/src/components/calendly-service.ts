function getCalendlyToken(token: string) {
    return `Bearer ${token}`
}

export type InviteeRefType = {
    email: string
    timezone: string
    name: string
}

export type CalendlyEventRef = {
    name: string
    scheduling_url: string
}

export type EventRefType = {
    name: string
    start_time: string
    end_time: string
    event_memberships: {
        user_email: string
        user_name: string
    }[]
}

export async function getTnviteeInfo(
    inviteeURI: string,
    token: string
): Promise<InviteeRefType | null> {
    try {
        const data = await fetch(inviteeURI, {
            headers: {
                Authorization: getCalendlyToken(token),
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())

        return data.resource
    } catch (error) {
        console.error('Error fetching Calendly organization URI', error)

        return null
    }
}

export async function getEventInfo(
    eventURI: string,
    token: string
): Promise<EventRefType | null> {
    try {
        const data = await fetch(eventURI, {
            headers: {
                Authorization: getCalendlyToken(token),
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())

        return data.resource
    } catch (error) {
        console.error('Error fetching Calendly organization URI', error)

        return null
    }
}
