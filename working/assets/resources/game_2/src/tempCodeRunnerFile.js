let obj = {}

        obj[10] = {aadad:10, ccc:20};
        obj[11] = {aadad:100, ccc:200};
        obj[18] = {aadad:10000, ccc:20000};
        obj[14] = {aadad:1000, ccc:2000};
        obj.asdasd = 11121;

        
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const element = obj[key];
                console.log(element);
            }
        }