export default (req, res) => {
    // console.log({ req });

    // TODO: Replace with fetched data
    const records = [
        {
            title: 'AMRAP 7 mins',
            type: 'EXERCISE',
            time: '2021-01-29',
            text: `
AMRAP 7 mins
- 5 strict pull-ups
- 10 45lb dumbbell deadlifts
- 15 20kg goblet squats

Score: 3 + 22      
            `,
        },
        {
            title: '5x5 back squat, 40X1',
            type: 'EXERCISE',
            time: '2021-02-02',
            text: `
5x5 back squat, 40X1

165lb

Felt hard, but good!    
            `,
        },
    ];

    res.status(200).json({ records });
};
