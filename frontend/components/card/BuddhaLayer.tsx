/* eslint-disable @next/next/no-img-element */

export function BuddhaLayer() {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '1%',
          top: '50%',
          zIndex: 45,
          width: '24%',
          minWidth: 88,
          maxWidth: 238,
          transform: 'translateY(-43%)',
          pointerEvents: 'none'
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '22%',
            width: '122%',
            height: '62%',
            transform: 'translateX(-50%)',
            borderRadius: '999px',
            background: 'rgba(255, 232, 143, 0.36)',
            filter: 'blur(20px)'
          }}
        />
        <img
          src="/symbols/lord-buddha-vesak.png"
          alt=""
          decoding="async"
          loading="eager"
          style={{
            position: 'relative',
            display: 'block',
            width: '100%',
            height: 'auto',
            filter: 'drop-shadow(0 0 34px rgba(255, 224, 139, 0.9))'
          }}
        />
      </div>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '2%',
          top: '50%',
          zIndex: 28,
          width: '31%',
          minWidth: 110,
          maxWidth: 315,
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          opacity: 0.34
        }}
      >
        <img
          src="/symbols/lord-buddha-vesak.png"
          alt=""
          decoding="async"
          loading="eager"
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            filter: 'drop-shadow(0 0 30px rgba(255, 224, 139, 0.72))'
          }}
        />
      </div>
    </>
  )
}
