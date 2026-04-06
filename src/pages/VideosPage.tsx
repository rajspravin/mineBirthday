import { BackLink } from '../components/ui/BackLink'
import { PageContainer } from '../components/layout/PageContainer'
import { VideoSection } from '../components/video/VideoSection'

export default function VideosPage() {
  return (
    <PageContainer>
      <BackLink />
      <VideoSection />
    </PageContainer>
  )
}
