/**
 * 카테고리, 아이템 ID, 펫의 진화 단계를 기반으로 서버의 Action ID를 계산합니다.
 * @param category 'feed', 'play', 'gift' 중 하나
 * @param localItemId 각 카테고리 내 아이템의 순서 (1, 2, 3)
 * @param evolutionStage 펫의 현재 진화 단계 (1, 2, 3)
 * @returns 계산된 Action ID
 */
export function calculateActionId(
    category: 'feed' | 'play' | 'gift',
    localItemId: number,
    evolutionStage: number
): number {
    // 1. 카테고리별 시작 ID 설정
    let categoryBaseId = 0;
    switch (category) {
        case 'play':
            categoryBaseId = 1; // 'play'는 1번부터 시작
            break;
        case 'feed':
            categoryBaseId = 10; // 'feed'는 10번부터 시작
            break;
        case 'gift':
            categoryBaseId = 19; // 'gift'는 19번부터 시작
            break;
    }

    // 2. 진화 단계에 따른 오프셋 계산 (한 진화 단계당 3개의 아이템)
    const evolutionOffset = (evolutionStage - 1) * 3;

    // 3. 아이템 순서에 따른 오프셋 계산 (localItemId는 1-based이므로 0-based로 변환)
    const itemOffset = localItemId - 1;

    // 최종 actionId = 시작 ID + 진화 오프셋 + 아이템 오프셋
    return categoryBaseId + evolutionOffset + itemOffset;
}