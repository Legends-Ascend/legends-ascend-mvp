import { generatePositionSlots, isPositionCompatible, FORMATION_POSITIONS } from '../models/Squad';

describe('Squad Model Utilities', () => {
  describe('generatePositionSlots', () => {
    it('should generate correct positions for 4-3-3 formation', () => {
      const positions = generatePositionSlots('4-3-3');
      
      expect(positions).toHaveLength(18); // 11 starters + 7 bench
      
      const gkPositions = positions.filter(p => p.position_slot.startsWith('GK_'));
      expect(gkPositions).toHaveLength(1);
      
      const dfPositions = positions.filter(p => p.position_slot.startsWith('DF_'));
      expect(dfPositions).toHaveLength(4);
      
      const mfPositions = positions.filter(p => p.position_slot.startsWith('MF_'));
      expect(mfPositions).toHaveLength(3);
      
      const fwPositions = positions.filter(p => p.position_slot.startsWith('FW_'));
      expect(fwPositions).toHaveLength(3);
      
      const benchPositions = positions.filter(p => p.position_slot.startsWith('BENCH_'));
      expect(benchPositions).toHaveLength(7);
      
      // Check slot types
      const starters = positions.filter(p => p.slot_type === 'STARTER');
      expect(starters).toHaveLength(11);
      
      const bench = positions.filter(p => p.slot_type === 'BENCH');
      expect(bench).toHaveLength(7);
    });

    it('should generate correct positions for 4-2-4 formation', () => {
      const positions = generatePositionSlots('4-2-4');
      
      expect(positions).toHaveLength(18);
      
      const dfPositions = positions.filter(p => p.position_slot.startsWith('DF_'));
      expect(dfPositions).toHaveLength(4);
      
      const mfPositions = positions.filter(p => p.position_slot.startsWith('MF_'));
      expect(mfPositions).toHaveLength(2);
      
      const fwPositions = positions.filter(p => p.position_slot.startsWith('FW_'));
      expect(fwPositions).toHaveLength(4);
    });

    it('should generate correct positions for 5-3-2 formation', () => {
      const positions = generatePositionSlots('5-3-2');
      
      const dfPositions = positions.filter(p => p.position_slot.startsWith('DF_'));
      expect(dfPositions).toHaveLength(5);
      
      const mfPositions = positions.filter(p => p.position_slot.startsWith('MF_'));
      expect(mfPositions).toHaveLength(3);
      
      const fwPositions = positions.filter(p => p.position_slot.startsWith('FW_'));
      expect(fwPositions).toHaveLength(2);
    });

    it('should generate correct positions for 3-5-2 formation', () => {
      const positions = generatePositionSlots('3-5-2');
      
      const dfPositions = positions.filter(p => p.position_slot.startsWith('DF_'));
      expect(dfPositions).toHaveLength(3);
      
      const mfPositions = positions.filter(p => p.position_slot.startsWith('MF_'));
      expect(mfPositions).toHaveLength(5);
      
      const fwPositions = positions.filter(p => p.position_slot.startsWith('FW_'));
      expect(fwPositions).toHaveLength(2);
    });

    it('should generate correct positions for 4-4-2 formation', () => {
      const positions = generatePositionSlots('4-4-2');
      
      const dfPositions = positions.filter(p => p.position_slot.startsWith('DF_'));
      expect(dfPositions).toHaveLength(4);
      
      const mfPositions = positions.filter(p => p.position_slot.startsWith('MF_'));
      expect(mfPositions).toHaveLength(4);
      
      const fwPositions = positions.filter(p => p.position_slot.startsWith('FW_'));
      expect(fwPositions).toHaveLength(2);
    });

    it('should throw error for invalid formation', () => {
      expect(() => generatePositionSlots('3-4-3')).toThrow('Invalid formation: 3-4-3');
    });
  });

  describe('isPositionCompatible', () => {
    it('should allow GK players in GK slots', () => {
      expect(isPositionCompatible('GK', 'GK_1')).toBe(true);
    });

    it('should not allow FW players in GK slots', () => {
      expect(isPositionCompatible('FW', 'GK_1')).toBe(false);
    });

    it('should allow DF players in DF slots', () => {
      expect(isPositionCompatible('DF', 'DF_1')).toBe(true);
      expect(isPositionCompatible('DF', 'DF_4')).toBe(true);
    });

    it('should not allow MF players in DF slots', () => {
      expect(isPositionCompatible('MF', 'DF_1')).toBe(false);
    });

    it('should allow MF players in MF slots', () => {
      expect(isPositionCompatible('MF', 'MF_1')).toBe(true);
      expect(isPositionCompatible('MF', 'MF_3')).toBe(true);
    });

    it('should allow FW players in FW slots', () => {
      expect(isPositionCompatible('FW', 'FW_1')).toBe(true);
      expect(isPositionCompatible('FW', 'FW_3')).toBe(true);
    });

    it('should allow UT (Utility) players in any position', () => {
      expect(isPositionCompatible('UT', 'GK_1')).toBe(true);
      expect(isPositionCompatible('UT', 'DF_1')).toBe(true);
      expect(isPositionCompatible('UT', 'MF_1')).toBe(true);
      expect(isPositionCompatible('UT', 'FW_1')).toBe(true);
      expect(isPositionCompatible('UT', 'BENCH_1')).toBe(true);
    });

    it('should allow any position on bench', () => {
      expect(isPositionCompatible('GK', 'BENCH_1')).toBe(true);
      expect(isPositionCompatible('DF', 'BENCH_3')).toBe(true);
      expect(isPositionCompatible('MF', 'BENCH_5')).toBe(true);
      expect(isPositionCompatible('FW', 'BENCH_7')).toBe(true);
    });
  });

  describe('FORMATION_POSITIONS', () => {
    it('should have all required formations', () => {
      expect(FORMATION_POSITIONS).toHaveProperty('4-3-3');
      expect(FORMATION_POSITIONS).toHaveProperty('4-2-4');
      expect(FORMATION_POSITIONS).toHaveProperty('5-3-2');
      expect(FORMATION_POSITIONS).toHaveProperty('3-5-2');
      expect(FORMATION_POSITIONS).toHaveProperty('4-4-2');
    });

    it('should have 11 starters and 7 bench for each formation', () => {
      Object.entries(FORMATION_POSITIONS).forEach(([formation, config]) => {
        const startersCount = Object.values(config.starters).reduce((a, b) => a + b, 0);
        expect(startersCount).toBe(11);
        expect(config.bench).toBe(7);
      });
    });

    it('should always have 1 GK in each formation', () => {
      Object.entries(FORMATION_POSITIONS).forEach(([formation, config]) => {
        expect(config.starters.GK).toBe(1);
      });
    });
  });
});
