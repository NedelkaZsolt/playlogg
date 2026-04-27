import { Router } from 'express'

const router = Router()

function timeAgo(timestamp: number) {
  const seconds = Math.max(0, Math.floor(Date.now() / 1000) - timestamp)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}p`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}ó`
  const days = Math.floor(hours / 24)
  return `${days}n`
}

function tagColorForTitle(title: string) {
  return title.toLowerCase().includes('major') || title.toLowerCase().includes('cs2')
    ? '#3b82f6'
    : '#8b5cf6'
}

function isHot(title: string) {
  return /major|frissítés|update|rang|esemény|event|battle pass|cs2/i.test(title)
}

router.get('/', async (_req, res) => {
  try {
    const count = Number(_req.query.count ?? 10)
    const response = await fetch(
      `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=730&count=${count}&maxlength=250&format=json`
    )

    if (!response.ok) {
      return res.status(502).json({ error: 'Steam news API error' })
    }

    const json = await response.json()
    const items = (json?.appnews?.newsitems ?? [])
      .slice(0, 10)
      .map((item: any) => ({
        title: item.title as string,
        source: 'Steam News',
        time: timeAgo(item.date as number),
        tag: 'CS2',
        tagColor: tagColorForTitle(item.title as string),
        hot: isHot(item.title as string),
        url: item.url as string,
      }))

    res.json(items)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message || 'Could not fetch CS:GO news' })
  }
})

export default router
