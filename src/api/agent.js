const ENNOIA_URL = 'https://api.ennoia.so/api/preset/v2/chat/completions'
const HASH = '0c39f2b9a675c59ca1d86cad3dd66684beed52e836b4e38ffdfbeae6aec8bfe2'

const callAgent = async (requestType, params) => {
  const response = await fetch(ENNOIA_URL, {
    method: 'POST',
    headers: {
      'project': 'KNTO-PROMPTON-2026-466',
      'apiKey': import.meta.env.VITE_ENNOIA_API_KEY,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      hash: HASH,
      params: {
        request_type: requestType,
        ...params,
      },
      messages: [{ role: 'user', content: [{ type: 'text', text: '추천해줘' }] }],
    }),
  })

  if (!response.ok) {
    throw new Error(`API 오류: ${response.status}`)
  }

  const data = await response.json()

  // 에이전트 응답에서 JSON 파싱
  const text = data.content
    .filter(item => item.type === 'text')
    .map(item => item.text)
    .join('')

  return JSON.parse(text)
}

// 단건 추천
export const fetchRecommendation = (params) => callAgent('single', params)

// 전체 목록
export const fetchPlaceList = (params) => callAgent('list', params)

// 장소 상세
export const fetchPlaceDetail = (googlePlaceId) => callAgent('detail', { google_place_id: googlePlaceId })