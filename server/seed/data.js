const img = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&fm=auto&fit=crop`;

const P = {
  sofa1: img('photo-1555041469-a586c61ea9bc'),
  sofa2: img('photo-1493663284031-b7e3aefcae8e'),
  sofa3: img('photo-1567016432779-094069958ea5'),
  sofa4: img('photo-1583847268964-b28dc8f51f92'),
  living1: img('photo-1586023492125-27b2c045efd7'),
  living2: img('photo-1616486338812-3dadae4b4ace'),
  living3: img('photo-1618221195710-dd6b41faaea6'),
  living4: img('photo-1616486029423-aaa4789e8c9a'),
  living5: img('photo-1493809842364-78817add7ffb'),
  living6: img('photo-1522708323590-d24dbb6b0267'),
  living7: img('photo-1484101403633-562f891dc89a'),
  armchair: img('photo-1592078615290-033ee584e267'),
  chair: img('photo-1567538096630-e0c55bd6374c'),
  dining: img('photo-1533090481720-856c6e3c1fdc'),
  dining2: img('photo-1600585154340-be6161a56a0c'),
  bedroom: img('photo-1505693416388-ac5ce068fe85'),
  bedroom2: img('photo-1522771739844-6a9f6d5f14af'),
  bedroom3: img('photo-1584100936595-c0654b55a2e2'),
  bedroom4: img('photo-1513694203232-719a280e022f'),
  car1: img('photo-1503376780353-7e6692767b70'),
  car2: img('photo-1552519507-da3b142c6e3d'),
  car3: img('photo-1502877338535-766e1452684a'),
  car4: img('photo-1549399542-7e3f8b79c341'),
  fabric1: img('photo-1631679706909-1844bbd07221', 900),
  fabric2: img('photo-1620799140408-edc6dcb6d633', 900),
  fabric3: img('photo-1616627981207-91b1f47f3756', 900),
  fabric4: img('photo-1600334129128-685c5582fd35', 900),
  texture: img('photo-1616594039964-ae9021a400a0', 900),
};

module.exports = { P };
