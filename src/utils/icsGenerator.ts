// Utility for generating .ics Calendar files & Google Calendar links

export function generateIcsFile() {
  const title = 'SCI 65th Foundation Day Celebration - NCPA Mumbai';
  const description = 'The Shipping Corporation of India Ltd. 65th Foundation Day. "65 Years of Moving India. Now, Towards New Horizons." Please present your Digital Boarding Pass at the registration desk.';
  const location = 'NCPA (National Centre for the Performing Arts), Nariman Point, Mumbai, Maharashtra 400021';
  
  // Start: 02 Oct 2026 at 17:30 IST (12:00 UTC)
  // End:   02 Oct 2026 at 22:30 IST (17:00 UTC)
  const startUTC = '20261002T120000Z';
  const endUTC = '20261002T170000Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Shipping Corporation of India//65th Foundation Day//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:sci-65th-${Date.now()}@shipindia.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${startUTC}`,
    `DTEND:${endUTC}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'ORGANIZER;CN="The Shipping Corporation of India Ltd.":mailto:events@shipindia.com',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'SCI_65th_Foundation_Day_Invitation.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getGoogleCalendarLink() {
  const title = encodeURIComponent('SCI 65th Foundation Day Celebration');
  const details = encodeURIComponent('The Shipping Corporation of India Ltd. 65th Foundation Day. "65 Years of Moving India. Now, Towards New Horizons." Please show your Digital Boarding Pass at registration.');
  const location = encodeURIComponent('NCPA, Nariman Point, Mumbai');
  // 02 Oct 2026 17:30 IST to 22:30 IST (20261002T120000Z/20261002T170000Z)
  const dates = '20261002T120000Z/20261002T170000Z';
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}
