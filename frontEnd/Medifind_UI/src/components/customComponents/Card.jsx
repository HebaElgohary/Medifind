
import { motion } from "framer-motion";

// eslint-disable-next-line react/prop-types
export function Card({ component, index }) {
    return (
        <motion.div
            className=""
            initial={{
                opacity: 0,
                // if odd index card,slide from right instead of left
                x: index % 2 === 0 ? -500 : 500,
            }}
            whileInView={{
                opacity: 1,
                x: 0, // Slide in to its original position
                transition: {
                    duration: 1, // Animation duration
                },
            }}
            viewport={{ once: true }}
        >

            {component}
        </motion.div>
    );
}


