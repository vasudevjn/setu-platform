import type { Course } from '../types'

export const mockCourses: Course[] = [
  {
    id: 'course_digital',
    title: 'Digital Tools for Business',
    summary: 'Help a shop get found online and take digital payments.',
    skill: 'Digital marketing',
    lessons: [
      {
        id: 'lsn_digital_1',
        title: 'Google Business Listings',
        body: 'A free Google listing is often the first thing a customer sees before they visit a shop. It shows the shop name, address, hours and photos on Google Search and Maps. To set one up, search for the shop name on Google, claim the listing if it already exists, or create one with the exact shop name, the right category, the address, phone number and opening hours. Add at least five clear photos of the shopfront, the inside, and a few products, and ask happy customers to leave a review. Keep the hours updated, especially on holidays, since a wrong open or closed status can cost a shop a customer who almost walked in.',
      },
      {
        id: 'lsn_digital_2',
        title: 'WhatsApp Business Basics',
        body: "WhatsApp Business is a free app built for shops and small businesses. It looks like normal WhatsApp but adds a few useful tools. A catalog lets a shop show its products with photos and prices right inside the chat, so a customer can browse without asking what is available every time. Quick replies save common answers, like the shop address or today's offers, so the owner does not have to type the same message again and again. A greeting message welcomes new customers, and an away message lets people know when the shop is closed, once business hours are set. Start small: build a catalog of the ten best selling items first, then add more over time.",
      },
      {
        id: 'lsn_digital_3',
        title: 'Digital Payments and QR Codes',
        body: "A UPI QR code lets customers pay straight from their phone, with no cash needed. Most shops print or stick one QR code near the counter, linked to the owner's bank account through a UPI app. When a customer pays, always wait for the confirmation sound or message before handing over the goods, since a screenshot shown by the customer is not proof of payment on its own. Keep a simple daily note of digital payments received, separate from cash, so the day's total is easy to check against the bank statement. If the shop does not have a QR code yet, most banks and UPI apps can generate one for free in a few minutes.",
      },
    ],
  },
  {
    id: 'course_excel_tally',
    title: 'Excel and Tally Basics',
    summary: 'The spreadsheet and accounting skills most shops run on.',
    skill: 'Excel',
    lessons: [
      {
        id: 'lsn_exceltally_1',
        title: 'Excel for Daily Business',
        body: "Most shops track sales, stock or expenses in a spreadsheet, and a few basics go a long way. SUM adds up a column of numbers, like a day's sales or a month's expenses: select the cell below the numbers and type =SUM( followed by the range, like A2:A31. Sorting arranges rows by a column, high to low or A to Z, which makes it easy to see the best selling item or the largest expense at a glance. Keep entries clean, with one row per transaction, the same date format throughout, and no merged cells in the data area, since clean entry now saves a lot of confusion later.",
      },
      {
        id: 'lsn_exceltally_2',
        title: 'Tally Basics',
        body: 'Tally is accounting software used by many small and medium businesses in India to record their books. A voucher is a single entry, like a sale, a purchase or a payment, and each voucher type keeps a different kind of transaction organised. A ledger groups all the vouchers for one account, like a supplier or a bank, and looking at a ledger shows the full history and running balance for that account. Every voucher should be entered on the day it happens, with the correct ledger chosen, so the books stay accurate and up to date.',
      },
      {
        id: 'lsn_exceltally_3',
        title: 'Keeping Clean Records',
        body: "Good bookkeeping is less about clever tricks and more about steady habits. Enter each day's transactions on the same day, while the details are still fresh, since waiting till week's end makes mistakes more likely. Keep one file or ledger per month, clearly named, so anything can be found quickly later. Before closing the books for the day, double check the totals against the cash or bank balance, since catching a small mismatch today is much easier than finding it a month later.",
      },
    ],
  },
  {
    id: 'course_gst_billing',
    title: 'GST and Billing Essentials',
    summary: 'What every invoice needs, and how to follow up kindly.',
    skill: 'GST basics',
    lessons: [
      {
        id: 'lsn_gstbilling_1',
        title: 'What is GST',
        body: "GST, or Goods and Services Tax, is a single tax charged on the sale of most goods and services in India, and it replaced several older taxes with one system. A business registered for GST charges it on sales and can claim back the GST it paid on its own purchases, and the difference is what gets paid to the government. Not every small business needs to register, since it depends on the business's yearly turnover and the state it operates in. Understanding this basic idea makes the rest of billing and invoicing much easier to follow.",
      },
      {
        id: 'lsn_gstbilling_2',
        title: 'Making a GST Invoice',
        body: "A proper GST invoice needs a few required details to be valid: an invoice number and date, the seller's name, address and GSTIN, and the buyer's details for larger sales. It needs a clear description of each item or service, the quantity, the rate, and the GST rate applied. It needs the total before tax, the GST amount, and the final total after tax, shown separately. A missing GSTIN or an unclear tax breakup is one of the most common invoice mistakes, so it helps to double check these before sending an invoice out.",
      },
      {
        id: 'lsn_gstbilling_3',
        title: 'Following Up on Payments Kindly',
        body: 'Even a correct invoice sometimes needs a follow-up before it gets paid, and doing this well protects the relationship, not just the payment. Send a friendly reminder a few days after the due date, not the same day, with something simple like asking if the invoice reached them okay and if it is convenient to settle this week. If there is no reply, a second, slightly firmer message after another week is reasonable, mentioning the invoice number and amount clearly and asking if any issue is holding up payment. Staying polite and assuming good faith first works best, since most late payments are about a busy schedule, not an unwillingness to pay.',
      },
    ],
  },
]
