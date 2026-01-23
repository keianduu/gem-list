export default function PageTitle({ enLabel, title, subtitle }) {
    return (
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{
                fontFamily: 'var(--font-en)', fontSize: '0.8rem', letterSpacing: '0.1em',
                color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '8px'
            }}>
                {enLabel}
            </span>
            <h1 className="section-title">{title}</h1>
            <p className="section-subtitle">{subtitle}</p>
        </div>
    );
}
