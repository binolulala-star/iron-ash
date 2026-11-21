/* ======================= HOOKS INSTALL (must stay last in the manifest) ======================= */
{const o=startBattle;startBattle=function(...a){HOOK.run('b','startBattle',a);const r=o(...a);HOOK.run('a','startBattle',a);return r;};}
{const o=buildFree;buildFree=function(...a){HOOK.run('b','buildFree',a);const r=o(...a);HOOK.run('a','buildFree',a);return r;};}
{const o=buildTown;buildTown=function(...a){HOOK.run('b','buildTown',a);const r=o(...a);HOOK.run('a','buildTown',a);return r;};}
{const o=buildSet;buildSet=function(...a){HOOK.run('b','buildSet',a);const r=o(...a);HOOK.run('a','buildSet',a);return r;};}
{const o=enterMap;enterMap=function(...a){HOOK.run('b','enterMap',a);const r=o(...a);HOOK.run('a','enterMap',a);return r;};}
