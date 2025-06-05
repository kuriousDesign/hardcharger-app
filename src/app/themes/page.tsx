import { CardsDemo } from "@/components/cards"



export const revalidate = false

export default function ThemesPage() {
  return (
    <>
      <div id="themes" className="container-wrapper scroll-mt-20">

      </div>
      <div className="container-wrapper section-soft flex flex-1 flex-col pb-6">
        <div className="theme-container container flex flex-1 flex-col">
          <CardsDemo />
        </div>
      </div>
    </>
  )
}
