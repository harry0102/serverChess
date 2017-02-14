module.exports = {
    OK: 200, 			//成功
    FAIL: 500,			//未知错误 
    DB_ERROR: 501, 		//数据库错误
    
    CONNECTOR: {
        // MAC错误
        FA_MAC_ERROR: 1001,
        // 密码错误
        FA_PWD_ERROR: 1002,
        // 角色不存在
        FA_PLAYER_NOT_EXIST: 1003,
        // 角色已存在
        FA_PLAYER_IS_EXIST: 1004
    },
    GATE: {
        // 无可用服务器
        FA_NO_SERVER_AVAILABLE: 2001
    },
    AREA: { 
        RECHAARGE_ID_NOT_EXIST: 3200
    },
    WORLD: {
        // 玩家已在线
        ALREADY_ONLINE: 6001
    },
	CHAT : {
		
	}
};