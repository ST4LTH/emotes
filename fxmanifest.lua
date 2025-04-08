fx_version 'cerulean'
games {'gta5'}

auther 'Edvin'
description 'Emote menu'

shared_scripts {
    'animations.lua'
}

client_scripts {
    'client/*.lua'
}

server_scripts {
    'server/*.lua'
}

ui_page 'web/dist/index.html'
--ui_page 'http://localhost:5173/' -- Dev

files {
    'conditionalanims.meta',
    'web/dist/index.html',
    'web/dist/**/*',
}

data_file 'DLC_ITYP_REQUEST' 'stream/rpemotesreborn_props.ytyp'

data_file 'DLC_ITYP_REQUEST' 'stream/brummie_props.ytyp'

data_file 'DLC_ITYP_REQUEST' 'stream/bzzz_props.ytyp'

data_file 'DLC_ITYP_REQUEST' 'stream/bzzz_camp_props.ytyp'

data_file 'DLC_ITYP_REQUEST' 'stream/apple_1.ytyp'

data_file 'DLC_ITYP_REQUEST' 'stream/kaykaymods_props.ytyp'

data_file 'DLC_ITYP_REQUEST' 'stream/knjgh_pizzas.ytyp'

data_file 'DLC_ITYP_REQUEST' 'stream/natty_props_lollipops.ytyp'

data_file 'DLC_ITYP_REQUEST' 'stream/ultra_ringcase.ytyp'

data_file 'DLC_ITYP_REQUEST' 'stream/pata_props.ytyp'

data_file 'DLC_ITYP_REQUEST' 'stream/vedere_props.ytyp'

data_file 'DLC_ITYP_REQUEST' 'stream/pnwsigns.ytyp'

data_file 'DLC_ITYP_REQUEST' 'stream/pprp_icefishing.ytyp'

data_file 'DLC_ITYP_REQUEST' 'stream/scully_props.ytyp'

data_file 'DLC_ITYP_REQUEST' 'stream/samnick_prop_lighter01.ytyp'

data_file 'DLC_ITYP_REQUEST' 'stream/bzzz_murderpack.ytyp'

lua54 'yes'