const materializedCategory = [
    {
        $graphLookup: {
            from: "categories",
            startWith: "$category",
            connectFromField: "category",
            connectToField: "parent",
            as: "categories",
            maxDepth: 4,
            depthField: "level"
        }
    },
    {
        $project: {
            "name":1,
            "parent":1,
            "category": 1,
            "categories._id":1,
            "categories.name":1,
            "categories.parent":1,
            "categories.category":1,
            "categories.level":1
        }
    },
    {
        $unwind: "$categories"
    },
    {
        $sort: { "categories.level": -1 }
    },
    {
        $group: {
            _id: "$_id",
            name: { $first: "$name" },
            parent: { $first: "$parent" },
            category: { $first: "$category" },
            categories: { $push: "$categories" }
        }
    },
    {
        $addFields: {
            categories: {
                $reduce: {
                    input: "$categories",
                    initialValue: {
                        currentLevel: -1,
                        currentLevelCategories: [],
                        previousLevelCategories: []
                    },
                    in: {
                        $let: {
                            vars: {
                                prev: { 
                                    $cond: [ 
                                        { $eq: [ "$$value.currentLevel", "$$this.level" ] }, 
                                        "$$value.previousLevelCategories", 
                                        "$$value.currentLevelCategories" 
                                    ] 
                                },
                                current: { 
                                    $cond: [ 
                                        { $eq: [ "$$value.currentLevel", "$$this.level" ] }, 
                                        "$$value.currentLevelCategories", 
                                        [] 
                                    ] 
                                }
                            },
                            in: {
                                currentLevel: "$$this.level",
                                previousLevelCategories: "$$prev",
                                currentLevelCategories: {
                                    $concatArrays: [
                                        "$$current", 
                                        [
                                            { $mergeObjects: [ 
                                                "$$this", 
                                                { categories: { $filter: { input: "$$prev", as: "e", cond: { $eq: [ "$$e.parent", "$$this.category"  ] } } } } 
                                            ] }
                                        ]
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    {
        $addFields: { categories: "$categories.currentLevelCategories" }
    },
    {
        $match: { parent: '/'}
    }
]

export default { materializedCategory }
