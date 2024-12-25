function getCalendlyToken(token: string) {
    //return 'Bearer eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzI5NDM3Mjk3LCJqdGkiOiI2ZDk2Y2ZiZC02ZWE1LTQ2MzEtOTRhZC1lZTYxNGYzZjUzZmMiLCJ1c2VyX3V1aWQiOiI5ZDBiNDViYy1lZWNhLTQxMzQtYTExYi0wZDljZjUxZGExY2MifQ.5mIo1-KlgFgTNK1CQjNRvNA-3B5d3pQJK6M-ttExsUjHvJN-78bw1f1f2FY_cY9vsl0RjsZYaqxxcojnACwpLg'
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
