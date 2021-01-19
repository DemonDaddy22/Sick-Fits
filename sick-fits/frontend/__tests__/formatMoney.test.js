import formatMoney from '../lib/formatMoney';

describe('formatMoney lib function', () => {
    it('works for fractional dollars', () => {
        expect(formatMoney(1)).toEqual('$0.01');
        expect(formatMoney(10)).toEqual('$0.10');
    });

    it('leaves off the cents', () => {
        expect(formatMoney(5000)).toEqual('$50');
        expect(formatMoney(100)).toEqual('$1');
        expect(formatMoney(900000000)).toEqual('$9,000,000');
    });

    it('works with both fractional and whole dollar values', () => {
        expect(formatMoney(7811)).toEqual('$78.11');
        expect(formatMoney(630)).toEqual('$6.30');
        expect(formatMoney(2400)).toEqual('$24');
        expect(formatMoney(987258071238)).toEqual('$9,872,580,712.38');
    });
});