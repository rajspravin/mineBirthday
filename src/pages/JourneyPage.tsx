import { Timeline } from '../components/timeline/Timeline'
import { PageContainer } from '../components/layout/PageContainer'
import { BackLink } from '../components/ui/BackLink'

export default function JourneyPage() {
  return (
    <PageContainer>
      <BackLink />
      <Timeline />
    </PageContainer>
  )
}
