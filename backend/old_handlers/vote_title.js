const table = "vote_title";

module.exports = {
    table,

    async all(knex) {
        console.log(`---${table}--all--start--id:`);
        return knex(table).select("*").where({is_closed: false})
    },

    async find(knex, id) {
        console.log(`---${table}--find--start--id:`, id);
        let maxValue= await knex.select('vote_title_id', 'answer', knex.raw('COUNT(*) as count'))
            .from('user_title')
            .where({'vote_title_id': id})
            .groupBy('vote_title_id', 'answer')
            .orderBy('count',"desc")
            .first()
        maxValue = maxValue.count

        return knex.select('T.*','O.*',
        knex.raw(`CASE WHEN count > 0 THEN count ELSE 0 END as count`),
            knex.raw(`CASE WHEN count = ${maxValue} THEN true ELSE false END as adoptflg`)
            )
            .from(`${table} as T`)
            .where({'T.id': id})
            .leftJoin('options as O', 'O.vote_title_id', 'T.id')
            .leftJoin(
                knex.select('vote_title_id', 'answer', knex.raw('COUNT(*) as count'))
                .from('user_title')
                .where({'vote_title_id': id})
                .groupBy('vote_title_id', 'answer')
                .as('U'), 'U.answer', 'O.option_number')

    },
    // 'count' > 0?  'count' : 0 ) こっちなら数値。でも列名指定できない。一旦保留。

    async new(knex,params) {
        console.log(`---${table}--new--start--:`);
        return knex(table)
            .insert({title: params.title, added_user_id: params.added_user_id, is_closed:false,updated:new Date()})
            .returning('*')
    },
}

