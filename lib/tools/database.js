import sql from 'mssql';

const config = {
    server: 'db31373.public.databaseasp.net',
    database: 'db31373',
    user: 'db31373',
    password: 'W@x8#b2HeP=6',
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true,
        multipleActiveResultSets: true,
    },
};

let pool;

export async function getConnection () {
    if ( !pool )
    {
        pool = await sql.connect( config );
    }
    return pool;
}
