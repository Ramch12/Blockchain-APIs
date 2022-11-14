const connection = require('./Mysql/connect');
const fetch = require('node-fetch-commonjs');


async function API() {
    try {
        let data = await fetch('https://api.bscscan.com/api?module=proxy&action=eth_blockNumber&apikey=7ZFBAKN8D3FS8KNWHASHEPEFXVCU84S76E')
        let { result } = await data.json();
        let block_height = parseInt(result, 16);
        let conn = await connection();
        let result1 = await conn.query("select * from last_scanned_block");

        let block = parseInt(result1[0][0].block, 16);

        for (i = block; i <= block_height; i++) {
            let token = i.toString(16);
            let URL = `https://api.bscscan.com/api?module=proxy&action=eth_getBlockByNumber&tag=0x${token}&boolean=true&apikey=7ZFBAKN8D3FS8KNWHASHEPEFXVCU84S76E`;
            let tr_data = await fetch(URL);
            let res = await tr_data.json();
            await conn.query('insert into blocks(block,blockNo) values(?)', [[i, token]]);

            res.result.transactions
                .forEach(async (element) => {
                    let data1 = await conn.query("select * from users where to_address=?", [element.to])
                    if (!data1[0].length) return
                    delete element.input;
                    await conn.query("insert into user_det set ?", element);
                });
            await conn.query('update last_scanned_block set block=?', [token]);
        }

    }
    catch (err) {
        console.log(err.message)
    }
}

API();

