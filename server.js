{\rtf1\ansi\ansicpg1251\cocoartf2865
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\froman\fcharset0 Times-Roman;}
{\colortbl;\red255\green255\blue255;\red78\green63\blue232;\red235\green233\blue255;}
{\*\expandedcolortbl;;\cssrgb\c38039\c36078\c92941;\cssrgb\c93725\c93333\c100000;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\sa240\partightenfactor0

\f0\fs28 \AppleTypeServices\AppleTypeServicesF65539 \cf2 \cb3 \expnd0\expndtw0\kerning0
const express = require('express');\
const \{ createCanvas, loadImage \} = require('canvas');\
const app = express();\
const PORT = process.env.PORT || 3000;\
\
// \uc0\u1055 \u1088 \u1103 \u1084 \u1072 \u1103  \u1089 \u1089 \u1099 \u1083 \u1082 \u1072  \u1085 \u1072  \u1074 \u1072 \u1096  \u1092 \u1086 \u1085 \
const BACKGROUND_URL = 'https://drive.google.com/uc?export=download&id=1FTAeLOAaHv2LDNEsx4vD_gZOqZIfeuHd';\
\
app.use(express.json(\{ limit: '10mb' \}));\
\
async function loadImageFromUrl(url) \{\
  if (!url) throw new Error('Image URL is missing');\
  const res = await fetch(url);\
  if (!res.ok) throw new Error(`Failed to fetch image: $\{url\} ($\{res.status\})`);\
  const buffer = await res.buffer();\
  return await loadImage(buffer);\
\}\
\
app.post('/generate', async (req, res) => \{\
  try \{\
    const \{ homeTeam, homeLogo, awayTeam, awayLogo, birthYear \} = req.body;\
\
    if (!homeTeam || !awayTeam || !birthYear) \{\
      return res.status(400).json(\{ error: 'Missing required fields' \});\
    \}\
\
    const width = 1920;\
    const height = 1080;\
    const canvas = createCanvas(width, height);\
    const ctx = canvas.getContext('2d');\
\
    // \uc0\u1047 \u1072 \u1075 \u1088 \u1091 \u1078 \u1072 \u1077 \u1084  \u1092 \u1086 \u1085 \
    const bgImage = await loadImageFromUrl(BACKGROUND_URL);\
    ctx.drawImage(bgImage, 0, 0, width, height);\
\
    // "\uc0\u1053 \u1072 \u1096 \u1077  \u1073 \u1091 \u1076 \u1091 \u1097 \u1077 \u1077 " \'97 \u1089 \u1074 \u1077 \u1088 \u1093 \u1091  \u1087 \u1086  \u1094 \u1077 \u1085 \u1090 \u1088 \u1091 \
    ctx.fillStyle = '#FFFFFF';\
    ctx.font = 'bold 72px Arial';\
    ctx.fillText('\uc0\u1053 \u1072 \u1096 \u1077  \u1073 \u1091 \u1076 \u1091 \u1097 \u1077 \u1077 ', width / 2, 50);\
\
    // \uc0\u1053 \u1072 \u1079 \u1074 \u1072 \u1085 \u1080 \u1103  \u1082 \u1086 \u1084 \u1072 \u1085 \u1076 \
    const teamNameY = 250;\
    const teamLogoY = 350;\
    const homeX = width * 0.25;\
    const awayX = width * 0.75;\
    const vsX = width / 2;\
\
    ctx.font = 'bold 48px Arial';\
    ctx.fillText(homeTeam, homeX, teamNameY);\
    ctx.fillText(awayTeam, awayX, teamNameY);\
\
    // \uc0\u1051 \u1086 \u1075 \u1086 \u1090 \u1080 \u1087 \u1099 \
    const logoSize = 200;\
    if (homeLogo) \{\
      const homeLogoImg = await loadImageFromUrl(homeLogo);\
      ctx.drawImage(homeLogoImg, homeX - logoSize / 2, teamLogoY, logoSize, logoSize);\
    \}\
    if (awayLogo) \{\
      const awayLogoImg = await loadImageFromUrl(awayLogo);\
      ctx.drawImage(awayLogoImg, awayX - logoSize / 2, teamLogoY, logoSize, logoSize);\
    \}\
\
    // "VS" \uc0\u1084 \u1077 \u1078 \u1076 \u1091  \u1083 \u1086 \u1075 \u1086 \u1090 \u1080 \u1087 \u1072 \u1084 \u1080 \
    ctx.font = 'bold 64px Arial';\
    ctx.fillText('VS', vsX, teamLogoY + logoSize / 2 - 32);\
\
    // \uc0\u1043 \u1086 \u1076  \u1088 \u1086 \u1078 \u1076 \u1077 \u1085 \u1080 \u1103  \'97 \u1089 \u1085 \u1080 \u1079 \u1091  \u1087 \u1086  \u1094 \u1077 \u1085 \u1090 \u1088 \u1091 \
    ctx.font = 'bold 48px Arial';\
    ctx.textBaseline = 'bottom';\
    ctx.fillText(birthYear, width / 2, height - 50);\
\
    // \uc0\u1054 \u1090 \u1087 \u1088 \u1072 \u1074 \u1083 \u1103 \u1077 \u1084  PNG\
    const buffer = canvas.toBuffer('image/png');\
    res.set('Content-Type', 'image/png');\
    res.set('Content-Length', buffer.length.toString());\
    res.send(buffer);\
  \} catch (error) \{\
    console.error('Error:', error.message);\
    res.status(500).json(\{ error: error.message \});\
  \}\
\});\
\
app.get('/health', (req, res) => \{\
  res.json(\{ status: 'OK', uptime: process.uptime() \});\
\});\
\
app.listen(PORT, () => \{\
  console.log(`Server running on port $\{PORT\}`);\
\});}