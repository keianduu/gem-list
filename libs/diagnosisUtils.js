/**
 * 診断結果の補助テキスト生成 (4軸の「揺らぎ」を表現)
 */
export function blendSentence(axisKey, pctRight) {
    // pctRight: 0..100
    const pctLeft = 100 - pctRight;
    const margin = Math.abs(pctRight - 50); // 0..50

    // 判定基準: 50±7(均衡) / ±17(やや寄り) / それ以上(明確)
    const band = (n) => (n < 8 ? 'balanced' : (n < 18 ? 'lean' : 'clear'));
    const b = band(margin);

    if (axisKey === 'world') {
        // right = 外向
        if (b === 'balanced') return '内と外、どちらにも重心を置けるバランス型。場に合わせて出方を変えられます。';
        if (pctRight > 50 && b === 'lean') return '内なる世界も大事にできるが、重心は外にある。人・場・出来事から意味を汲み取りやすい。';
        if (pctRight > 50 && b === 'clear') return '重心は外にある。外の世界に触れているほど、思考も感情も動きやすい。';
        if (pctLeft > 50 && b === 'lean') return '外の世界も大事にできるが、芯は内側にある。自分の中の基準を起点に進めます。';
        return '芯は内側にある。外の世界と距離を取りつつ、自分の内側で意味を育てられるタイプ。';
    }
    if (axisKey === 'orient') {
        // right = 逆転
        if (b === 'balanced') return '積み上げと勝負、両方を扱えるタイプ。状況で使い分けると強い。';
        if (pctRight > 50 && b === 'lean') return '積み上げもできるが、勝負どころでは逆転を狙える。勝ち筋が見えたら大きく踏み込めます。';
        if (pctRight > 50 && b === 'clear') return '逆転寄り。勝負の一手で流れを変えることにワクワクしやすい。';
        if (pctLeft > 50 && b === 'lean') return '逆転の魅力も分かるが、基本は積み上げ。小さく勝ち続ける設計が得意です。';
        return '積み上げ寄り。安定した勝ち方を作り、確実に前へ進めるタイプ。';
    }
    if (axisKey === 'judge') {
        // right = 論理
        if (b === 'balanced') return '論理と感情の両方で決められるタイプ。最後は「納得感」と「筋」の両方を取りにいけます。';
        if (pctRight > 50 && b === 'lean') return '感情も大事にするが、決め手は論理。筋の通り方で安心できます。';
        if (pctRight > 50 && b === 'clear') return '論理寄り。曖昧さを減らし、根拠で判断すると一番力が出ます。';
        if (pctLeft > 50 && b === 'lean') return '論理も理解できるが、決め手は感情（納得）。大事なのは自分の腑に落ちること。';
        return '感情寄り。関係性や温度感のズレに敏感で、納得できる形を重視します。';
    }
    if (axisKey === 'approach') {
        // right = 試走
        if (b === 'balanced') return '準備も試走もできるタイプ。期限・重要度で切り替えると最強。';
        if (pctRight > 50 && b === 'lean') return '準備もするが、まず試して調整する寄り。動きながら最適解に近づけます。';
        if (pctRight > 50 && b === 'clear') return '試走寄り。まず動いて情報を取り、走りながら形にしていくのが得意。';
        if (pctLeft > 50 && b === 'lean') return '試走もできるが、基本は準備。先に不安を潰すと安心して進めます。';
        return '準備寄り。段取りと見通しでリスクを減らし、堅実に成果を出せます。';
    }
    return '';
}
