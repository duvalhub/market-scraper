describe('rnd', () => {
    it('should resolved its imports', async () => {

try {

        const a = await import('../src/model')
        const { processPostsReponse } = await import('../src/posts')


        console.log(a)

}
catch(e) {
    console.error(e)
}



    })
})