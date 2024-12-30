import { InlineWidget, useCalendlyEventListener } from 'react-calendly'
import { processColor } from './utils'
import { CalendlyBlockProps } from './types'
import { useMemo } from 'react'
import { getEventInfo, getTnviteeInfo } from './calendly-service'

export function CalendlyBlock({ theme, url, onChange, token }: CalendlyBlockProps) {

  const pageSettings = useMemo(() => {
    return {
      backgroundColor: theme.palette ? processColor(theme.palette.background.default) : '',
      textColor: theme.palette ? processColor(theme.palette.text.primary) : '',
      primaryColor: theme.palette ? processColor(theme.palette.primary.main) : ''
    }
  }, [theme])

  useCalendlyEventListener({
    onEventScheduled: (e) => {
      const eventURI = e.data.payload.event.uri
      const inviteeURI = e.data.payload.invitee.uri

      Promise.all([getEventInfo(eventURI, token), getTnviteeInfo(inviteeURI, token)]).then(
        ([event, invitee]) => {
          if (event && invitee) {
            const { name, start_time, end_time, event_memberships } = event
            const { email, timezone, name: iv } = invitee

            onChange({
              event: {
                name,
                start_time,
                end_time,
                event_memberships: event_memberships.map((em) => ({
                  user_email: em.user_email,
                  user_name: em.user_name
                }))
              },
              invitee: { email, timezone, name: iv }
            })
          }
        }
      )
    }
    // additional events one can hook to
    // onProfilePageViewed: () => console.log('onProfilePageViewed'),
    // onDateAndTimeSelected: () => console.log('onDateAndTimeSelected'),
    // onEventTypeViewed: () => console.log('onEventTypeViewed'),
    // onPageHeightResize: (e) => console.log(e.data.payload.height)
  })


  return (
    <InlineWidget
      pageSettings={pageSettings}
      styles={{
        minWidth: 320,
        height: 700
      }}
      url={url}
    />
  )

}