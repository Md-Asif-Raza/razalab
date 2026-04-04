export default function SectionStatement() {
  return (
    <section id="statement" style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px 72px',
      textAlign: 'center',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      background: 'var(--c6)'
    }}>
      <h2 className="reveal-up" style={{
        fontFamily: 'var(--font-head)',
        fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
        fontWeight: 600,
        lineHeight: 1.25,
        letterSpacing: '-0.02em',
        maxWidth: '1300px',
        color: 'var(--text)'
      }}>
        We turn your long-form content into hundreds of short-form clips — distributed across every platform by a vetted network of clippers who only get paid when they perform. <br/><span style={{color: 'var(--c1)'}}>2 billion views and counting.</span>
      </h2>
    </section>
  );
}
