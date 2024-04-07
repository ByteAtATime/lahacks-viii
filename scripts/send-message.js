const WEBHOOK_URL =
  'https://discord.com/api/webhooks/1226474178350288897/5E-CpXb2sEo3HdozR_ICTbSesSwnOsZqpVZRWtpeyb1x5XiEhPsOvG7NRmtI7zelmYoE';
const TEAM = 'th0XEwS8ImHwIf9TdpfO';

const formatStroke = (stroke) => {
  switch (stroke) {
    case 'free':
      return 'FR';
    case 'back':
      return 'BK';
    case 'breast':
      return 'BR';
    case 'fly':
      return 'FL';
    case 'im':
      return 'IM';
    default:
      return stroke;
  }
};

export const formatTime = (time) => {
  const totalSeconds = Math.floor(time / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const hundredths = Math.floor((time % 1000) / 10);

  // Format the time components
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
  const hundredthsStr = hundredths < 10 ? `0${hundredths}` : `${hundredths}`;

  // Construct the formatted time string
  let formattedTime = `${minutesStr}:${secondsStr}.${hundredthsStr}`;

  // If the time is less than a minute, remove the leading "00:"
  if (minutes === 0) {
    formattedTime = formattedTime.substring(3);
  }

  return formattedTime;
};

export const formatItem = (item) =>
  `${item.amount > 1 ? item.amount + 'x' : ''}${item.distance} ${formatStroke(item.stroke)}${item.interval ? ' on the ' + formatTime(item.interval) : ''}`;

const setsRes = await fetch(`http://localhost:5173/api/today-sets?team=${TEAM}`);

const sets = await setsRes.json();

setInterval(async () => {
  await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      embeds: [
        {
          //           title: 'Sets for today',
          //           fields: sets.map((set) => ({
          //             name: set.name,
          //             value: `
          // *Warmup:*
          // ${set.set.warmup
          //                 .map(formatItem)
          //                 .map((it) => '- ' + it)
          //                 .join('\n')}
          //
          // *Main set:*
          // ${set.set.main
          //                 .map(formatItem)
          //                 .map((it) => '- ' + it)
          //                 .join('\n')}
          //
          // *Cooldown:*
          // ${set.set.cooldown
          //                 .map(formatItem)
          //                 .map((it) => '- ' + it)
          //                 .join('\n')}
          // `.trim()
          //           }))
          title: "PB's for today",
          fields: [
            {
              name: 'Calvin',
              value: '*100 Y Freestyle*: 1:02.58 → 0:59.12'
            },
            {
              name: 'Calvin',
              value: '*50 Y Backstroke*: 0:34.12 → 0:31.23'
            },
            {
              name: 'Oliver',
              value: '*200 Y IM*: 2:21.58 → 2:17.67'
            }
          ]
        }
      ]
    })
  });
}, 6000);
