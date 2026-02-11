# What next ?

## Optimisations

1. Drawing performance improvement.
2. Image upload - We are sending base64 image - 33% increase
   1. When you send and receive data - bandwidth - costly
   2. Latency because of large data.
   3. Solution: Upload the image (File - multipart) - less constly, limit the image size (Bad UX)
   4.If you want to store it on server.
   5. Upload image on server as soon as user selects the image


## Improvement (UX)
1. Cancel the request -> AbortController


## Features
1. Add new tools / filters
2. Remove background
3. Model selctor
4. Authentication - Better auth - postgres database
5. Payment system - Stripe, Razorpay - Credits

SAAS - Software as a service