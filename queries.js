// queries.js - run example queries against the sample `plp_bookstore.books` collection
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';

function short(obj, depth = 2) {
  const util = require('util');
  return util.inspect(obj, { depth, colors: false, compact: true });
}

async function runQueries() {
  const client = new MongoClient(uri);
  try {
	await client.connect();
	console.log('Connected to MongoDB server');

	const db = client.db(dbName);
	const collection = db.collection(collectionName);

	// 1) Find all books in genre "Fiction"
	console.log('\n1) Books in genre "Fiction":');
	const fiction = await collection.find({ genre: 'Fiction' }).toArray();
	if (!fiction.length) console.log('  (no documents)');
	fiction.forEach((b, i) => console.log(`  ${i + 1}. ${b.title} — ${b.author} (${b.published_year})`));

	// 2) Find books published after 1925
	console.log('\n2) Books published after 1925:');
	const after1925 = await collection.find({ published_year: { $gt: 1925 } }).toArray();
	if (!after1925.length) console.log('  (no documents)');
	after1925.forEach((b, i) => console.log(`  ${i + 1}. ${b.title} — ${b.published_year}`));

	// 3) Find books by Jane Austen
	console.log('\n3) Books by Jane Austen:');
	const jane = await collection.find({ author: 'Jane Austen' }).toArray();
	if (!jane.length) console.log('  (no documents)');
	jane.forEach((b, i) => console.log(`  ${i + 1}. ${b.title} — ${b.published_year}`));

	// 4) Update price of "1984"
	console.log('\n4) Update price of "1984" to 12.0:');
	const updateResult = await collection.updateOne({ title: '1984' }, { $set: { price: 12.0 } });
	console.log(`  Matched: ${updateResult.matchedCount}, Modified: ${updateResult.modifiedCount}`);

	// 5) Delete book titled "The Alchemist"
	console.log('\n5) Delete book titled "The Alchemist":');
	const deleteResult = await collection.deleteOne({ title: 'The Alchemist' });
	console.log(`  Deleted count: ${deleteResult.deletedCount}`);

	// 6) Find books in stock and published after 2010
	console.log('\n6) In-stock books published after 2010:');
	const recentInStock = await collection.find({ in_stock: true, published_year: { $gt: 2010 } }).toArray();
	if (!recentInStock.length) console.log('  (no documents)');
	recentInStock.forEach((b, i) => console.log(`  ${i + 1}. ${b.title} — ${b.published_year}`));

	// 7) Projection: return only title, author, and price
	console.log('\n7) Projection (title, author, price):');
	const projected = await collection.find({}, { projection: { title: 1, author: 1, price: 1, _id: 0 } }).limit(10).toArray();
	projected.forEach((p, i) => console.log(`  ${i + 1}. ${short(p, 1)}`));

	// 8) Sorting by price ascending (top 10 cheapest)
	console.log('\n8) Top 10 cheapest books (price asc):');
	const cheapest = await collection.find().sort({ price: 1 }).limit(10).toArray();
	cheapest.forEach((b, i) => console.log(`  ${i + 1}. ${b.title} — ${b.price}`));

	// 9) Sorting by price descending (top 10 expensive)
	console.log('\n9) Top 10 most expensive books (price desc):');
	const expensive = await collection.find().sort({ price: -1 }).limit(10).toArray();
	expensive.forEach((b, i) => console.log(`  ${i + 1}. ${b.title} — ${b.price}`));

	// 10) Pagination examples
	console.log('\n10) Pagination example - page 1 (first 5):');
	const page1 = await collection.find().skip(0).limit(5).toArray();
	page1.forEach((b, i) => console.log(`  ${i + 1}. ${b.title}`));

	console.log('\n10) Pagination example - page 2 (next 5):');
	const page2 = await collection.find().skip(5).limit(5).toArray();
	page2.forEach((b, i) => console.log(`  ${i + 1}. ${b.title}`));

	// 11) Average price of books by genre
	console.log('\n11) Average price by genre:');
	const avgByGenre = await collection.aggregate([
	  { $group: { _id: '$genre', avgPrice: { $avg: '$price' }, count: { $sum: 1 } } },
	  { $sort: { avgPrice: -1 } }
	]).toArray();
	avgByGenre.forEach(g => console.log(`  ${g._id}: avg=${g.avgPrice?.toFixed(2)} (${g.count} books)`));

	// 12) Author with the most books
	console.log('\n12) Author with the most books:');
	const topAuthor = await collection.aggregate([
	  { $group: { _id: '$author', count: { $sum: 1 } } },
	  { $sort: { count: -1 } },
	  { $limit: 1 }
	]).toArray();
	if (topAuthor.length) console.log(`  ${topAuthor[0]._id} (${topAuthor[0].count} books)`);

	// 13) Group books by decade
	console.log('\n13) Books grouped by decade:');
	const byDecade = await collection.aggregate([
	  { $project: { title: 1, published_year: 1, decade: { $multiply: [{ $floor: { $divide: ['$published_year', 10] } }, 10] } } },
	  { $group: { _id: '$decade', count: { $sum: 1 } } },
	  { $sort: { _id: 1 } }
	]).toArray();
	byDecade.forEach(d => console.log(`  ${d._id}s: ${d.count}`));

	// 14) Create indexes (if they don't exist). These are idempotent.
	console.log('\n14) Creating indexes:');
	const idx1 = await collection.createIndex({ title: 1 });
	console.log(`  Created index: ${idx1}`);
	const idx2 = await collection.createIndex({ author: 1, published_year: -1 });
	console.log(`  Created index: ${idx2}`);

	// 15) Explain performance of a query (executionStats)
	console.log('\n15) Explain for query { title: "1984" }');
	const explanation = await collection.find({ title: '1984' }).explain('executionStats');
	console.log('  Execution time (ms):', explanation.executionStats?.executionTimeMillis ?? 'N/A');
	console.log('  Total docs examined:', explanation.executionStats?.totalDocsExamined ?? 'N/A');

  } catch (err) {
	console.error('Error running queries:', err);
  } finally {
	await client.close();
	console.log('\nConnection closed');
  }
}

runQueries().catch(err => {
  console.error(err);
  process.exit(1);
});
