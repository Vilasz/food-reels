# 🔄 Comandos para Resetar e Popular o Banco de Dados

## 📋 Passo a Passo

Execute os comandos abaixo **na ordem** para atualizar sua base de dados com os vídeos do Donburizin:

### 1️⃣ Resetar o banco de dados (apaga todos os dados)
```powershell
npx prisma migrate reset --force
```

### 2️⃣ Popular com os novos dados (seed)
```powershell
npx prisma db seed
```

### 3️⃣ Verificar se os dados foram inseridos
```powershell
npx prisma studio
```

---

## 🎯 Comando Único (Alternativa)

Se preferir, pode executar tudo de uma vez:

```powershell
npx prisma migrate reset --force --skip-seed; npx prisma db seed
```

---

## ✅ O que foi configurado

### 📹 Vídeos
- **Tuna.mp4** → Tuna Sando de Donburizin
- **Salmao.mp4** → Spicy Salmão (6 pcs.) de Donburizin
- **Guioza.mp4** → Guioza de Porco (4 unidades) de Donburizin

### 🔗 Links configurados
1. **Tuna Sando**: https://pedido.anota.ai/product/68a7837672a924a4a93bab41/0/donburizin
2. **Spicy Salmão**: https://pedido.anota.ai/product/68af6c731368a56a54cf6f24/0/donburizin
3. **Guioza de Porco**: https://pedido.anota.ai/product/689cf8b8d239d61ecc8c5283/0/donburizin

### 📁 Estrutura de arquivos
- Vídeos movidos para: `public/videos/`
- URLs nos vídeos: `/videos/Tuna.mp4`, `/videos/Salmao.mp4`, `/videos/Guioza.mp4`

---

## 🚀 Próximos passos

Após executar os comandos acima:

1. Inicie o servidor de desenvolvimento:
```powershell
npm run dev
```

2. Acesse: http://localhost:3000

3. Você verá os três vídeos do Donburizin com os links corretos para pedido! 🍣

---

## 🐛 Em caso de erro

Se der erro ao executar a seed, tente:

```powershell
npx prisma generate
npx prisma db push --force-reset
npx prisma db seed
```

