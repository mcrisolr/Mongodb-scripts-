print ("__________________ \n database + collection + size and storageSize \n  ")


	var m = rs.isMaster();
	if( m.ismaster ) {
		function getReadableFileSizeString(fileSizeInBytes) {

		    var i = -1;
		    var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
		    do {
		        fileSizeInBytes = fileSizeInBytes / 1024;
		        i++;
		    } while (fileSizeInBytes > 1024);

		    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
		};

		var dbs=db.getMongo().getDBNames();
		        for(var ibd in dbs){
		        mdb = db.getSiblingDB(dbs[ibd]);
		        
		        
		        var collectionNames = mdb.getCollectionNames(), stats = [];
		        
		        if (mdb.getName() !== 'admin' && mdb.getName() !== 'local' && mdb.getName() !== 'config' ) {
		        
		        
		        collectionNames.forEach(function (n) { stats.push(mdb[n].stats()); });
		        stats = stats.sort(function(a, b) { return b['size'] - a['size']; });
		         print ("__________________ \n database + collection + size and storageSize \n  ")
		         
		         
		             for (var c in stats) { print(stats[c]['ns'] + ": " + getReadableFileSizeString(stats[c]['size']) + " " + getReadableFileSizeString(stats[c]['size']) + " (" + getReadableFileSizeString(stats[c]['storageSize']) + ")"); }
		  
		}
		  
		}
			
		print ("__________________ \n database + collection + index accesses: \n  ")
		
	db.adminCommand('listDatabases').databases.forEach(function(e){
	    if ((e.name == "admin" || e.name == "config" || e.name == "local")) return;
	    var database=e.name;
	    context=db.getSiblingDB(database);
	    context.getCollectionNames().forEach(function(collection){
		records=context.getCollection(collection).aggregate( 
		        [ 
		            { $indexStats: { } },
		            {
		                "$group" :
		                {
		                    _id : { name: "$name"},
		                    accesses:{$sum:"$accesses.ops"},
		                    since:{$min:"$accesses.since"},
		                }
		            },
		            {
		                "$project": 
		                {
		                    _id:0,
		                    name:"$_id.name",
		                    since:{ $dateToString: { format: "%Y-%m-%d-%H:%M:%S", date: "$since" } },
		                    accesses:"$accesses",
		                }
		            }
		        ]
		    ).forEach(function(index){
		        idx=index.name;
		        since=index.since;
		        accesses=index.accesses;
		        print(database+";"+collection+";"+idx+";"+since+";"+accesses);
		    });
	    });
	});
	     
	       
	} else {
	  print("Not PRIMARY. Nothing to do. Bye.")
	}				
