describe('sample test 101', () => {
    it('works as expected', () => {
        const age = 18;
        expect(1).toEqual(1);
        expect(age).toEqual(18);
    });

    it('ranges work too', () => {
        expect(20).toBeGreaterThanOrEqual(18);
    });
});