import { LoveLetterSection } from '../components/loveLetter/LoveLetterSection'
import { PageContainer } from '../components/layout/PageContainer'
import { BackLink } from '../components/ui/BackLink'

export default function LetterPage() {
  return (
    <PageContainer>
      <BackLink />
      <LoveLetterSection />
    </PageContainer>
  )
}
