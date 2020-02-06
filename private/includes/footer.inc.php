<nav>
    <ul>
        <li>
            <a class="menuExit"  title="Home Page" href="index.php" aria-haspopup='true'>Home</a>
            <ul>
                <li>
                    <a class="menuExit"  title="Blog Page" href="blog.php">Blog</a>
                </li>
                <li>
                    <a class="menuExit"  title="Gallery" href="gallery.php" aria-haspopup='true'>Gallery</a>
                    <ul>
                        <?php
                        if (is_logged_in()) {
                            echo '<li>';
                            echo '<a class="menuExit" title="Member Page" href="member_page.php">Member</a>';
                            echo '</li>';
                        }
                        ?>
                        <li>
                            <?php echo (is_logged_in()) ? '<a class="menuExit" title="Logout" href="logout.php">Logout</a>' : '<a class="menuExit"  title="Login Page" href="login.php">Login</a>'; ?>
                        </li>

                    </ul>
                </li>
            </ul>
        </li>
        <li>
            <a class="menuExit"  title="About Me" href="about.php">About</a>
        </li>
        <li>
            <a class="menuExit"  title="Contact Page" href="contact.php">Contact</a>
        </li>
        <li>
            <a id="movie" class="menuExit" data-category="movie" title="Trivia Game" href="triviaGame.php" aria-haspopup='true'>Movie Trivia</a>
            <ul>
                <li  id="addCategories">
                    <a id="space" class="menuExit" data-category="space" title="Space Trivia" href="triviaGame.php">Space Trivia</a>
                </li>
            </ul>
        </li>
    </ul>
</nav><!-- End of Navigation -->
<footer>
    &copy; The Miniature Photographer
    <div class="content">
        <a class="menuExit" title="Facebook Miniature Photographer" href="https://www.facebook.com/Pepster64/">Facebook Miniature Photographer Page</a>
<!--        <a title="Terms of Service" href="#">Terms of Service</a>-->
    </div>
</footer>
</div>
<?php if ($basename === 'blog.php' || $basename === 'index.php' || $basename === 'about.php' || $basename === 'gallery.php') { ?>
    <script src="assets/js/pagination.js"></script>
    <script src="assets/js/myLightRoom.js"></script>
<?php } ?>

<?php if ($basename === 'triviaGame.php') { ?>
    <script src="assets/js/game.js"></script>
<?php } ?>
</body>
</html>