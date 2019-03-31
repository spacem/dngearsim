import { CharacterService } from '../src/legacy/services/character.service';

describe('Character Service', () => {
    it('when no data given just gives empty list of stats', () => {
        const service = createService();
        const heroStats = service.getHeroStats(2);
        expect(heroStats.length).toBe(0);
    });
});

function createService() {
    const dntData = {
        findFast() {
            return [1];
        },
        getData() {
            return [];
        },
        getRow() {
            return {};
        }
    };
    const valueService =  {
        getStats() {
            return [];
        }
    };
    return new CharacterService(dntData, {}, {}, valueService, {});
}
