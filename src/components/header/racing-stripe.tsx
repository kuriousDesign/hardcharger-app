// components/RacingStripe.js
export default function RacingStripe() {
  return (
    <svg className="w-full h-32" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">

      <path d="M50 100 H200" stroke="red" stroke-width="17" strokeLinecap="butt" fill="none"/>
            <path d="M50 500 H600" stroke="red" stroke-width="17" strokeLinecap="butt" fill="none"/>

    </svg>
  );
}