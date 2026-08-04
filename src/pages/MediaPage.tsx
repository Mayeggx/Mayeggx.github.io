import './MediaPage.css'

const mediaUrl = 'https://bangumi.lol/user/336459'

export function MediaPage() {
  return <main className="media-page">
    <iframe className="media-frame" src={mediaUrl} title="Mayegg 的 Bangumi 媒体记录" />
  </main>
}
