aggregateQuery.push({
    $lookup: {
        from: 'Variants',
        let: { productId: '$product_id' },
        pipeline: [
            {
                $match: {
                    $expr: (() => {
                        if (req.query.variant_sku) {
                            {
                                $and: [
                                    { $eq: ['$product_id', '$$productId'] },
                                    {
                                        $eq: [createRegExpQuery(req.query.variant_sku), '$$variantSku'],
                                    },
                                ];
                            }
                        }
                        return { $eq: ['$product_id', '$$productId'] };
                    })(),
                },
            },
            {
                $lookup: {
                    from: 'Locations',
                    let: { variantId: '$variant_id' },
                    pipeline: [{ $match: { $expr: { $eq: ['$variant_id', '$$variantId'] } } }],
                    as: 'locations',
                },
            },
            { $unwind: { path: '$locations', preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    total_quantity: { $sum: '$locations.quantity' },
                },
            },
            // { $unwind: { path: '$locations', preserveNullAndEmptyArrays: true } },
            // {
            //     $group: {
            //         _id: {
            //             sku: '$sku',
            //             name: '$locations.name',
            //             inventory_id: '$locations.inventory_id',
            //         },
            //         name: { $first: '$locations.name' },
            //         inventory_id: { $first: '$locations.inventory_id' },
            //         quantity: { $sum: '$total_quantity' },
            //     },
            // },
        ],
        as: 'variants',
    },
});
if (req.query.store) {
    aggregateQuery.push(
        { $unwind: { path: '$variants', preserveNullAndEmptyArrays: true } },
        {
            $match: (() => {
                if (req.query.store_id) {
                    return {
                        'variants.locations.name': 'STORE',
                        'variants.locations.inventory_id': ObjectId(req.query.store_id),
                    };
                }
                return { 'variants.locations.name': 'STORE' };
            })(),
        }
    );
}
if (req.query.branch) {
    aggregateQuery.push(
        { $unwind: { path: '$variants', preserveNullAndEmptyArrays: true } },
        {
            $match: (() => {
                if (req.query.branch_id) {
                    return {
                        'variants.locations.name': 'BRANCH',
                        'variants.locations.inventory_id': ObjectId(req.query.branch_id),
                    };
                }
                return { 'variants.locations.name': 'BRANCH' };
            })(),
        }
    );
}
