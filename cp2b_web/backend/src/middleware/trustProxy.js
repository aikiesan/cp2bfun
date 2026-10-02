// De quem aceitar o X-Forwarded-For, que diz o IP do visitante.
//
// Na VM o backend só recebe conexões do Apache da própria máquina, e o Apache
// recebe as do proxy da Unicamp, que termina o TLS. Sem confiar em ninguém,
// o req.ip era o endereço do Apache para todo visitante, e os dois limites
// por IP (envios públicos e tentativas de login, ver index.js e routes/auth.js)
// viravam um balde só para o site inteiro: dez envios de quem quer que fosse
// travavam o formulário de contato de todo mundo por 15 minutos.
//
// TRUST_PROXY lista, separados por vírgula, os saltos confiáveis: "loopback"
// (o Apache da VM, o padrão) e o IP do proxy da Unicamp. Nada além disso:
// um salto a mais na lista deixa o visitante escolher o próprio IP pelo
// cabeçalho e fugir dos limites.
export function trustProxySetting(value = process.env.TRUST_PROXY) {
  const hops = String(value ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  return hops.length ? hops : ['loopback'];
}

// Um valor inválido (um nome de máquina no lugar do IP, por exemplo) faz o
// Express lançar erro já no app.set, e o backend nem subiria. Fica o padrão,
// com o aviso no log.
export function applyTrustProxy(app, value = process.env.TRUST_PROXY) {
  try {
    app.set('trust proxy', trustProxySetting(value));
  } catch (err) {
    console.error(`⛔ TRUST_PROXY inválido ("${value}"): ${err.message}. Usando só loopback.`);
    app.set('trust proxy', ['loopback']);
  }
  return app.get('trust proxy');
}
