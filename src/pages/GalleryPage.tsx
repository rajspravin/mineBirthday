import { BackLink } from '../components/ui/BackLink'
import { PhotoGallery } from '../components/gallery/PhotoGallery'
import { PageContainer } from '../components/layout/PageContainer'

export default function GalleryPage() {
  return (
    <PageContainer>
      <BackLink />
      <PhotoGallery />
    </PageContainer>
  )
}
